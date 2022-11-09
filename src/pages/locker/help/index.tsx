/* eslint-disable @next/next/link-passhref */
import { useActiveWeb3React } from '../../../hooks'

import Head from 'next/head'
import React from 'react'
import { useRouter } from 'next/router'
import NavLink from '../../../components/NavLink'
import Link from 'next/link'
import Card from '../../../components/Card'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import DoubleGlowShadow from '../../../components/DoubleGlowShadow'
import { LOCKER_ADDRESS } from '../../../constants'
import SolarbeamLogo from '../../../components/SolarbeamLogo'

export default function CreateLocker(): JSX.Element {
  const { i18n } = useLingui()
  const router = useRouter()
  const { chainId } = useActiveWeb3React()

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
            <div className={`col-span-12 justify-center flex w-full`} style={{ minHeight: '30rem' }}>
              <Card className="h-full bg-dark-900 z-4 w-full lg:w-9/12">
                <div className={`grid grid-cols-12 gap-4`}>
                  <div className={`col-span-12 bg-dark-800 px-6 py-4 rounded`}>
                    <div className="mb-2 text-2xl text-emphesis text-center">{i18n._(t`How to use`)}</div>
                    <div className="mb-4 text-base text-secondary">
                      <p>
                        {i18n._(
                          t`- Input your token or liquidity pair address, amount of tokens to lock, withdrawer address and when tokens will become unlocked`
                        )}
                      </p>
                      <p>{i18n._(t`- Click on "Approve" to allow the contract to transfer your tokens`)}</p>
                      <p>{i18n._(t`- Click on "Deposit" to lock your tokens into locker contract`)}</p>
                    </div>
                    <div className="mb-2 text-2xl text-emphesis text-center">{i18n._(t`Fees`)}</div>{' '}
                    <div className="mb-4 text-base text-secondary">
                      <p>{i18n._(t`- 0.1 MOVR to lock`)}</p>
                    </div>
                    <div className="mb-2 text-2xl text-emphesis text-center">{i18n._(t`Considerations`)}</div>{' '}
                    <div className="mb-4 text-base text-secondary">
                      <p>{i18n._(t`- You will not be able to withdraw your tokens before the unlock time`)}</p>
                      <p>{i18n._(t`- Locker contract address: ${LOCKER_ADDRESS[chainId || 1285]}`)}</p>
                      <p>{i18n._(t`- Always DYOR`)}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </DoubleGlowShadow>
      </div>
    </>
  )
}
