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
            <div className={`col-span-12 justify-center flex w-full`} style={{ minHeight: '30rem' }}>
              <Card className="h-full border border-transparent border-gradient-r-blue-cobalt-primary-alt-bg z-4 w-full lg:w-9/12">
                <div className={`grid grid-cols-12 gap-4`}>
                  <div className={`col-span-12 bg-section-bg px-6 py-4 rounded`}>
                    <div className="mb-2 text-2xl text-emphesis text-center">{i18n._(t`How to use`)}</div>
                    <div className="mb-4 text-base text-white">
                      <p>
                        {i18n._(
                          t`- Input your token or liquidity pair address, amount of tokens to lock, withdrawer address and when tokens will become unlocked`
                        )}
                      </p>
                      <p>{i18n._(t`- Click on "Approve" to allow the contract to transfer your tokens`)}</p>
                      <p>{i18n._(t`- Click on "Deposit" to lock your tokens into locker contract`)}</p>
                    </div>
                    <div className="mb-2 text-2xl text-emphesis text-center">{i18n._(t`Fees`)}</div>{' '}
                    <div className="mb-4 text-base text-white">
                      <p>{i18n._(t`- 0.1 MOVR to lock`)}</p>
                    </div>
                    <div className="mb-2 text-2xl text-emphesis text-center">{i18n._(t`Considerations`)}</div>{' '}
                    <div className="mb-4 text-base text-white">
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
