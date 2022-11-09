/* eslint-disable @next/next/link-passhref */
import { useActiveWeb3React } from '../../hooks'
import Head from 'next/head'
import React, { useCallback, useEffect, useState } from 'react'
import Search from '../../components/Search'
import { classNames, isAddress } from '../../functions'
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
import moment from 'moment'
import { useToken } from '../../hooks/Tokens'
import { CurrencyAmount } from '../../sdk'
import Button from '../../components/Button'
import { getAddress } from '@ethersproject/address'
import { useRouter } from 'next/router'

export default function Locker(): JSX.Element {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const [tokenAddress, setTokenAddress] = useState(undefined)
  const token = useToken(isAddress(tokenAddress) ? tokenAddress : undefined)
  const [pendingTx, setPendingTx] = useState(false)
  const addTransaction = useTransactionAdder()

  const [lockers, setLockers] = useState([])

  const lockerContract = useLocker()

  const router = useRouter();

  

  useEffect(() => {
    if (isAddress(tokenAddress)) {
      lockerContract.getLockersByTokenAddress(tokenAddress).then((r) => {
        if (r.length > 0) {
          setLockers(r.filter((x) => x.withdrawn == false))
        }
      })
    }
  }, [tokenAddress, lockerContract])

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

  return (
    <>
      <Head>
        <title>Locker | Solarbeam</title>
        <meta key="description" name="description" content="Solarbeam Locker" />
      </Head>

      <div className="container px-0 mx-auto pb-6">
        <div className={`grid grid-cols-12 gap-4`}>
          <div className="flex justify-center items-center col-span-12 lg:justify">
            <Link href="/">
              <SolarbeamLogo />
            </Link>
          </div>
        </div>
        <DoubleGlowShadow maxWidth={false} opacity={'0.3'}>
          <div className={`grid grid-cols-12 gap-2 min-h-1/2`}>
          <div className={`col-span-12 justify-center flex flex-col md:flex-row  md:mb-6`}>
              <NavLink
                exact
                href={'/locker'}
                activeClassName="font-bold bg-transparent border rounded md:rounded-l md:rounded-none text-high-emphesis border-transparent border-gradient-r-yellow-dark-900"
              >
                <div className="flex items-center gap-2 justify-start md:justify-center px-16 py-4 text-base font-bold border border-transparent border-gradient-r-yellow-dark-900 rounded md:rounded-l-3xl md:rounded-none cursor-pointer">
                  {router.asPath == '/locker' && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6 order-last md:order-first"
                    >
                      <path
                        fillRule="evenodd"
                        d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  <a>{i18n._(t`Search lockers`)}</a>
                </div>
              </NavLink>
              <NavLink
                exact
                href={'/locker/create'}
                activeClassName="font-bold bg-transparent border md:border-l-0 md:border-r-0 rounded md:rounded-none text-high-emphesis border-transparent border-gradient-r-yellow-dark-900"
              >
                <div className="flex items-center gap-2 justify-start md:justify-center px-16 py-4 text-base font-bold border md:border-l-0 md:border-r-0 rounded md:rounded-none border-transparent border-gradient-r-yellow-dark-900 cursor-pointer">
                  {router.asPath == '/locker/create' && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6 order-last md:order-first"
                    >
                      <path
                        fillRule="evenodd"
                        d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  <a>{i18n._(t`Create lock`)}</a>
                </div>
              </NavLink>
              <NavLink
                exact
                href={'/locker/help'}
                activeClassName="font-bold bg-transparent border rounded md:rounded-r md:rounded-none text-high-emphesis border-transparent border-gradient-r-yellow-dark-900"
              >
                <div className="flex items-center gap-2 justify-start md:justify-center px-16 py-4 text-base font-bold border border-transparent rounded md:rounded-r-3xl md:rounded-none border-gradient-r-yellow-dark-900 cursor-pointer">
                  {router.asPath == '/locker/help' && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6 order-last md:order-first"
                    >
                      <path
                        fillRule="evenodd"
                        d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  <a>{i18n._(t`User Guide`)}</a>
                </div>
              </NavLink>
            </div>
            <div className={`col-span-12 justify-center flex w-full`} style={{ minHeight: '35rem' }}>
              <Card className="h-full bg-dark-900 z-4 w-full lg:w-9/12">
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
                                'w-full px-4 py-6 text-left rounded select-none bg-dark-700  text-primary text-sm md:text-lg'
                              )}
                            >
                              <div className="grid grid-cols-5">
                                <div className="flex col-span-2 items-center">
                                  {token?.name} ({token?.symbol})
                                </div>
                                <div className="flex flex-col justify-center items-center">
                                  {CurrencyAmount.fromRawAmount(token, locker?.amount).toSignificant(6)}
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
      </div>
    </>
  )
}
