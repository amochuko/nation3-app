import { ethers } from 'ethers'
import { useState, useEffect } from 'react'
import { nationDropAmount, nationToken } from '../lib/config'
import {
  useClaimsFiles,
  checkEligibility,
  useIsClaimed,
  useClaimDrop,
} from '../lib/merkle-drop'
import { useHandleError } from '../lib/use-handle-error'
import { useAccount } from '../lib/use-wagmi'
import ActionButton from '../components/ActionButton'
import Confetti from '../components/Confetti'
import Head from '../components/Head'
import MainCard from '../components/MainCard'

export default function Claim() {
  const [{ data: account }] = useAccount()
  const [canClaim, setCanClaim] = useState(false)
  const [contractId, setContractId] = useState(0)
  const [proofIndex, setProofIndex] = useState()
  const [justClaimed, setJustClaimed] = useState(false)

  const [{ data: claimsFiles }] = useHandleError(useClaimsFiles())
  const [{ data: isClaimed }] = useIsClaimed(contractId, proofIndex)

  useEffect(() => {
    if (claimsFiles && account) {
      const [contractId, index] = checkEligibility(claimsFiles, account.address)
      if (typeof index === 'number') {
        setContractId(contractId)
        setProofIndex(index)
        setCanClaim(!isClaimed)
      }
    }
  }, [account, claimsFiles, contractId, proofIndex, isClaimed])

  const claimDrop = useClaimDrop({
    contractId: contractId,
    index: proofIndex,
    account: account?.address,
    amount: ethers.utils.parseEther(nationDropAmount),
    proof:
      canClaim && claimsFiles
        ? claimsFiles[contractId].claims[account?.address]?.proof
        : {},
  })

  return (
    <>
      <Head title="Claim your $NATION" />
      {justClaimed && <Confetti />}
      {!justClaimed ? (
        <MainCard title="$NATION tweetdrop">
          <p>
            {!account
              ? `Connect your account to see if you are eligible ⚡️`
              : canClaim
              ? `You are eligible to claim ${nationDropAmount} $NATION 🎉`
              : `If you have participated in the $NATION tweetdrop, you can
                      claim here. If not, you can buy $NATION.`}
          </p>

          <div className="stats stats-vertical lg:stats-horizontal shadow my-4">
            <div className="stat">
              <div className="stat-figure text-secondary">
                {canClaim ? (
                  <ActionButton
                    className="btn btn-primary normal-case font-medium grow"
                    action={claimDrop}
                    postAction={() => setJustClaimed(true)}
                  >
                    Claim
                  </ActionButton>
                ) : (
                  <a
                    className="btn btn-primary normal-case font-medium grow"
                    href={`https://app.balancer.fi/#/trade/ether/${nationToken}`}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Buy $NATION
                  </a>
                )}
              </div>
              <div className="stat-title">Your claimable</div>
              <div className="stat-value">
                {canClaim ? nationDropAmount : 0}
              </div>
              <div className="stat-desc">$NATION</div>
            </div>
          </div>
        </MainCard>
      ) : (
        <MainCard title="Welcome new $NATION holder!" gradientBg={true}>
          <p className="text-white">
            Your $NATION was claimed successfully! 🎉
          </p>
          <p className="text-white">
            Go lock your $NATION for $veNATION so you can get yourself a Genesis
            passport on launch and become a citizen of Nation3!
          </p>
        </MainCard>
      )}
    </>
  )
}