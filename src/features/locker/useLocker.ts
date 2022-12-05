import { useLockerContract, useTokenContract, useScorerContract } from '../../hooks'
import { BigNumber } from '@ethersproject/bignumber'
import { Zero } from '@ethersproject/constants'
import { useCallback } from 'react'
import { useToken } from '../../hooks/Tokens'

export default function useLocker() {
  const contract = useLockerContract()
  const scorerContract = useScorerContract()
  const tokenContract = useTokenContract()

  const lockTokens = useCallback(
    async (token: string, withdrawer: string, amount: BigNumber, unlockTimestamp: string) => {
      try {
        return await contract?.lockTokens(token, withdrawer, amount.toString(), unlockTimestamp, {
          value: '0',
        })
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [contract]
  )

  const withdrawTokens = useCallback(
    async (id: string) => {
      try {
        return await contract?.withdrawTokens(id)
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [contract]
  )

  const extendLock = useCallback(
    async (id: string, duration) => {
      try {
        return await contract?.extendLock(id, duration)
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [contract]
  )

  const getLockersByTokenAddress = useCallback(
    async (token: string) => {
      try {
        const lockersIds = await contract?.getDepositsByTokenAddress(token)
        const result = []
        if (lockersIds.length > 0) {
          for (const id of lockersIds) {
            const lockerInfo = await contract?.lockedToken(id.toString())
            const scoreVisible = false
            const scoreValue = lockerInfo ? await scorerContract?.getScore(lockerInfo?.token) : 0;
            result.push({ id, scoreVisible, scoreValue, ...lockerInfo })
          }
        }
        return result
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [contract, tokenContract]
  )

  return { lockTokens, getLockersByTokenAddress, withdrawTokens, extendLock }
}
