import React, { useState } from 'react'
import { useAccount, useConnect } from 'wagmi'

export default function Claim() {
  const [{ data: connectData, error: connectError }, connect] = useConnect()
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  })

  return (
    <>
      <div class="hero bg-gradient-to-r from-n3blue-100 to-n3green-100 flex-auto overflow-auto">
        <div class="hero-content">
          <div class="max-w-md">
            <div class="card w-96 bg-base-100 shadow-xl">
              <div class="card-body items-stretch items-center">
                <h2 class="card-title text-center">$NATION tweetdrop</h2>
                <p>
                  If you have participated in the $NATION tweetdrop, you can
                  claim here. If not, you can buy $NATION.
                </p>

                <div class="stats stats-vertical lg:stats-horizontal shadow my-4">
                  <div class="stat">
                    <div class="stat-figure text-secondary">
                      <button class="btn btn-primary grow">Claim</button>
                    </div>
                    <div class="stat-title">Your claimable</div>
                    <div class="stat-value">5</div>
                    <div class="stat-desc">NATION tokens</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}