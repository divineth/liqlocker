/* eslint-disable @next/next/link-passhref */
import Head from 'next/head'
import React, { useCallback, useEffect, useState } from 'react'
import Search from '../../components/Search'
import { classNames, isAddress, tryParseAmount } from '../../functions'
import NavLink from '../../components/NavLink'
import Link from 'next/link'
import Card from '../../components/Card'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import DoubleGlowShadow from '../../components/DoubleGlowShadow'
import SolarbeamLogo from '../../components/SolarbeamLogo'
import { useTransactionAdder } from '../../state/transactions/hooks'
import useLocker from '../../features/locker/useLocker'
import { Disclosure } from '@headlessui/react'
import * as moment from 'moment'
import { useCurrency, useToken } from '../../hooks/Tokens'
import { CurrencyAmount } from '../../sdk'
import { getAddress } from '@ethersproject/address'
import { useRouter } from 'next/router'
import ExtendLockModal from '../../modals/ExtendLockModal'
import ProgressBar from '../../components/ProgressBar'
import NumericalInput from '../../components/NumericalInput'
import { utils } from 'ethers'
import Web3Connect from '../../components/Web3Connect'
import Button, { ButtonConfirmed, ButtonError } from '../../components/Button'
import { AutoRow, RowBetween } from '../../components/Row'
import Loader from '../../components/Loader'
import { ApprovalState, useActiveWeb3React, useApproveCallback } from '../../hooks'
import { SCORER_ADDRESS } from '../../constants'
import { useAddPopup } from '../../state/application/hooks'

export default function Locker(): JSX.Element {
  const { i18n } = useLingui()
  const { account, chainId } = useActiveWeb3React()
  const [tokenAddress, setTokenAddress] = useState('0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8')
  const token = useToken(isAddress(tokenAddress) ? tokenAddress : undefined)
  const [pendingTx, setPendingTx] = useState(false)
  const [chosenLockDate, setChosenLockDate] = useState()
  const [chosenLockID, setChosenLockID] = useState()
  const [commitmentValue, setCommitmentValue] = useState('')

  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false)
  const addTransaction = useTransactionAdder()

  const [lockers, setLockers] = useState([])

  const [openLockers, setOpenLockers] = useState([])

  const lockerContract = useLocker()

  const router = useRouter()

  const addPopup = useAddPopup()

  const assetToken = useCurrency(tokenAddress) || undefined

  const typedValue = tryParseAmount(commitmentValue, assetToken)

  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  const [approvalState, approve] = useApproveCallback(typedValue, SCORER_ADDRESS[chainId])

  const errorMessage = isNaN(parseFloat(commitmentValue)) || parseFloat(commitmentValue) == 0 ? 'Invalid Amount' : ''

  const allInfoSubmitted = errorMessage == ''

  useEffect(() => {
    if (isAddress(tokenAddress)) {
      lockerContract.getLockersByTokenAddress(tokenAddress).then((r) => {
        if (r.length > 0) {
          setLockers(r.filter((x) => x.withdrawn == false))
        }
      })
    } else if (lockers.length > 0) {
      setLockers([])
    }
  }, [tokenAddress])

  useEffect(() => {
    if (approvalState === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approvalState, approvalSubmitted])

  const handleWithdraw = useCallback(
    async (id) => {
      setPendingTx(true)

      try {
        const tx = await lockerContract.withdrawTokens(id)
        addTransaction(tx, {
          summary: `${i18n._(t`Withdraw from locker ${id}`)}`,
        })
      } catch (error) {
        console.error(error)
      }
      setPendingTx(false)
    },
    [addTransaction, i18n, lockerContract]
  )

  const handleExtend = useCallback(
    async (id, duration) => {
      setPendingTx(true)

      try {
        const tx = await lockerContract.extendLock(id, moment.default(duration).unix().toString())
        addTransaction(tx, {
          summary: `Extend locker for ${id}`,
        })
      } catch (error) {
        console.error(error)
      }
      setPendingTx(false)
    },
    [addTransaction, lockerContract]
  )

  const showModal = (lockId, unlockDate) => {
    setChosenLockID(lockId)
    setChosenLockDate(unlockDate)
    setIsExtendModalOpen(true)
  }

  const dismissModal = () => {
    setIsExtendModalOpen(false)
    setChosenLockDate(undefined)
    setChosenLockID(undefined)
  }

  const toggleScore = (locker) => {
    if (openLockers.includes(locker?.id)) {
      setOpenLockers([])
    } else {
      setCommitmentValue('')
      setOpenLockers([locker?.id])
    }
  }

  const handleCommit = useCallback(async () => {
    if (allInfoSubmitted) {
      setPendingTx(true)

      try {
        const tx = await lockerContract.commitCollateral(commitmentValue.toBigNumber(assetToken?.decimals))

        if (tx.wait) {
          const result = await tx.wait()
          addPopup({
            txn: { hash: result.transactionHash, summary: 'Successfully committed collateral', success: true },
          })
          setCommitmentValue('')
        } else {
          throw 'User denied transaction signature.'
        }
      } catch (err) {
        addPopup({
          txn: { hash: undefined, summary: `Failed to create lock: ${err}`, success: false },
        })
      } finally {
        setPendingTx(false)
      }
    }
  }, [allInfoSubmitted, addPopup, assetToken, tokenAddress, commitmentValue, lockerContract])

  const handleApprove = useCallback(async () => {
    await approve()
  }, [approve])

  useEffect(() => {
    (async () => {
      if (isAddress(tokenAddress)) {
        const collateralValue = await lockerContract.getLockerCollateral(tokenAddress)
        lockers.map((locker) => {
          locker.collateralValue = collateralValue
        })
      }
    })()
  }, [handleCommit])

  return (
    <>
      <Head>
        <title>Locker</title>
        <meta key="description" name="description" content="Solarbeam Locker" />
      </Head>

      <div className="container px-0 mx-auto md:pt-20 pb-6">
        {/* <div className={`grid grid-cols-12 gap-4`}>
          <div className="flex justify-center items-center col-span-12 lg:justify">
            <Link href="/">
              <SolarbeamLogo />
            </Link>
          </div>
        </div> */}
        <DoubleGlowShadow maxWidth={false} opacity={'0.3'}>
          <div className={`grid grid-cols-12 gap-2 min-h-1/2`}>
            <div className={`col-span-12 justify-center flex flex-col md:flex-row  md:mb-6`}>
              <NavLink
                exact
                href={'/locker'}
                activeClassName="font-bold bg-transparent border rounded md:rounded-l md:rounded-none text-high-emphesis border-transparent border-gradient-r-silver-cobalt"
              >
                <div className="flex items-center gap-2 justify-start md:justify-center px-16 py-4 text-base font-bold border border-transparent border-gradient-r-silver-primary-alt-bg rounded md:rounded-l-3xl md:rounded-none cursor-pointer">
                  <a>{i18n._(t`Search lockers`)}</a>
                </div>
              </NavLink>
              <NavLink
                exact
                href={'/locker/create'}
                activeClassName="font-bold bg-transparent border md:border-l-0 md:border-r-0 rounded md:rounded-none text-high-emphesis border-transparent border-gradient-r-silver-cobalt"
              >
                <div className="flex items-center gap-2 justify-start md:justify-center px-16 py-4 text-base font-bold border md:border-l-0 md:border-r-0 rounded md:rounded-none border-transparent border-gradient-r-silver-primary-alt-bg cursor-pointer">
                  <a className="text-[#b3b4b5]">{i18n._(t`Create lock`)}</a>
                </div>
              </NavLink>
              <NavLink
                exact
                href={'/locker/help'}
                activeClassName="font-bold bg-transparent border rounded md:rounded-r md:rounded-none text-high-emphesis border-transparent border-gradient-r-silver-cobalt"
              >
                <div className="flex items-center gap-2 justify-start md:justify-center px-16 py-4 text-base font-bold border border-transparent rounded md:rounded-r-3xl md:rounded-none border-gradient-r-silver-primary-alt-bg cursor-pointer">
                  <a>{i18n._(t`User Guide`)}</a>
                </div>
              </NavLink>
            </div>
            <div className={`col-span-12 justify-center flex w-full`} style={{ minHeight: '35rem' }}>
              <Card className="h-full border border-transparent border-gradient-r-blue-cobalt-primary-alt-bg z-4 w-full lg:w-9/12">
                <Search
                  placeholder={'Search by address'}
                  term={tokenAddress}
                  search={(value: string): void => {
                    setTokenAddress(value)
                  }}
                />
                {lockers.length == 0 && isAddress(tokenAddress) && (
                  <div className="flex justify-center items-center col-span-12 lg:justify mt-20">
                    <span>
                      No lockers found for this address,{' '}
                      <Link href="/locker/create">
                        <a className="hover:underline hover:text-yellow">click here</a>
                      </Link>{' '}
                      to create one.
                    </span>
                  </div>
                )}
                {lockers.length > 0 && (
                  <div className="grid grid-cols-5 text-base font-bold text-primary mt-10 mb-2">
                    <div className="flex items-center col-span-2 px-2">
                      <div className="hover:text-high-emphesis">{i18n._(t`Token`)}</div>
                    </div>
                    <div className="flex items-center justify-center">{i18n._(t`Amount Locked`)}</div>
                    <div className="items-center justify-end px-2 flex col-span-2">{i18n._(t`Unlock date`)}</div>
                    {/* <div className="items-center justify-end px-2 flex ">{i18n._(t``)}</div> */}
                  </div>
                )}
                <div className="flex-col">
                  {lockers.map((locker, index) => {
                    return (
                      <Disclosure key={index}>
                        {() => (
                          <div className="mb-4">
                            <Disclosure.Button
                              className={classNames(
                                'w-full px-4 py-6 text-left rounded select-none bg-primary-bg  text-primary text-sm md:text-lg'
                              )}
                            >
                              <div className="grid grid-cols-5">
                                <div className="flex flex-col col-span-2 items-start justify-center">
                                  <div className="flex flex-col sm:flex-row gap-2 items-start">
                                    {token?.name} ({token?.symbol})
                                    <div className="text-xs text-right md:text-base text-secondary">
                                      <Button
                                        variant="link"
                                        style={{ width: '100%', padding: '0' }}
                                        onClick={() => toggleScore(locker)}
                                      >
                                        {!openLockers.includes(locker?.id) ? '+' : '-'}
                                      </Button>
                                    </div>
                                  </div>

                                  {openLockers.includes(locker?.id) && (
                                    <div className="flex flex-col gap-2">
                                      <div className="flex flex-col text-xs text-left md:text-base text-white">
                                        {locker?.scoreValue <= 0
                                          ? 'Lock does not meet our requirements'
                                          : `Health Score ${utils.formatUnits(locker?.scoreValue, 2)}%:`}
                                        <ProgressBar width={50} percent={locker?.scoreValue / 10000} />
                                      </div>
                                      <div className="flex flex-col text-xs text-left md:text-base text-white">
                                        Committed Collateral 40.0%:
                                        <ProgressBar width={50} percent={locker?.scoreValue / 10000} />
                                      </div>
                                      <div className={'flex items-center w-64'}>
                                        <NumericalInput
                                          className={'p-3 text-base rounded bg-[#020A23]'}
                                          id="token-amount-input"
                                          value={commitmentValue}
                                          onUserInput={(val) => {
                                            setCommitmentValue(val)
                                          }}
                                          placeholder={'Tokens to commit'}
                                        />
                                      </div>
                                      <div className={'flex items-center w-64'}>
                                        <div className={'flex items-center w-full'}>
                                          {!account ? (
                                            <Web3Connect
                                              size="lg"
                                              color="gray"
                                              className="w-full"
                                              buttonText="Connect"
                                            />
                                          ) : !allInfoSubmitted ? (
                                            <ButtonError
                                              className="font-bold"
                                              style={{ width: '100%' }}
                                              disabled={!allInfoSubmitted}
                                            >
                                              {errorMessage}
                                            </ButtonError>
                                          ) : (
                                            <RowBetween>
                                              {approvalState !== ApprovalState.APPROVED && (
                                                <ButtonConfirmed
                                                  onClick={handleApprove}
                                                  disabled={
                                                    approvalState !== ApprovalState.NOT_APPROVED ||
                                                    approvalSubmitted ||
                                                    !allInfoSubmitted
                                                  }
                                                >
                                                  {approvalState === ApprovalState.PENDING ? (
                                                    <div className={'p-2'}>
                                                      <AutoRow gap="6px" justify="center">
                                                        Approving <Loader stroke="white" />
                                                      </AutoRow>
                                                    </div>
                                                  ) : (
                                                    i18n._(t`Approve`)
                                                  )}
                                                </ButtonConfirmed>
                                              )}
                                              {approvalState === ApprovalState.APPROVED && (
                                                <ButtonError
                                                  className="font-bold text-light"
                                                  onClick={handleCommit}
                                                  style={{
                                                    width: '100%',
                                                  }}
                                                  disabled={
                                                    approvalState !== ApprovalState.APPROVED ||
                                                    !allInfoSubmitted ||
                                                    pendingTx
                                                  }
                                                >
                                                  {pendingTx ? (
                                                    <div className={'p-2'}>
                                                      <AutoRow gap="6px" justify="center">
                                                        Committing <Loader stroke="white" />
                                                      </AutoRow>
                                                    </div>
                                                  ) : (
                                                    i18n._(t`Commit`)
                                                  )}
                                                </ButtonError>
                                              )}
                                            </RowBetween>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  {/* {locker?.scoreVisible && (

                                  )} */}
                                </div>
                                <div className="flex flex-col justify-center items-center">
                                  {token?.name
                                    ? CurrencyAmount.fromRawAmount(token, locker?.amount).toSignificant(6)
                                    : 0}
                                </div>
                                <div className="flex flex-col col-span-2 items-end justify-center">
                                  <div className="text-xs text-right md:text-base text-secondary">
                                    {moment.unix(locker?.unlockTimestamp.toString()).fromNow()}
                                  </div>
                                  <div className="text-xs text-right md:text-base text-secondary">
                                    <Button
                                      variant="link"
                                      style={{ width: '100%', paddingLeft: '0', paddingRight: '0' }}
                                      onClick={() => handleWithdraw(locker?.id)}
                                      disabled={
                                        moment.unix(locker?.unlockTimestamp.toString()).isAfter(new Date()) ||
                                        !account ||
                                        (account && getAddress(account) != getAddress(locker?.withdrawer))
                                      }
                                    >
                                      Withdraw
                                    </Button>
                                  </div>
                                  <div className="text-xs text-right md:text-base text-secondary">
                                    <Button
                                      variant="link"
                                      style={{ width: '100%', paddingLeft: '0', paddingRight: '0' }}
                                      onClick={() => showModal(locker?.id, locker?.unlockTimestamp.toString())}
                                      disabled={
                                        moment.unix(locker?.unlockTimestamp.toString()).isAfter(new Date()) ||
                                        !account ||
                                        (account && getAddress(account) != getAddress(locker?.withdrawer))
                                      }
                                    >
                                      Extend Lock
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </Disclosure.Button>
                          </div>
                        )}
                      </Disclosure>
                    )
                  })}
                </div>
              </Card>
            </div>
          </div>
        </DoubleGlowShadow>
        <ExtendLockModal
          isOpen={isExtendModalOpen}
          onDismiss={dismissModal}
          title={'Extend Lock'}
          lockId={chosenLockID}
          currentDate={chosenLockDate}
          extend={handleExtend}
        />
      </div>
    </>
  )
}
