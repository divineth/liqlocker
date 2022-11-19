import { ANALYTICS_URL } from '../../constants'
import { ChainId } from '../../sdk'
import ExternalLink from '../ExternalLink'
import Polling from '../Polling'
import { t } from '@lingui/macro'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { useLingui } from '@lingui/react'
import React from 'react'
import NavLink from '../NavLink'
import Image from 'next/image'

const Footer = () => {
  const { chainId } = useActiveWeb3React()
  const { i18n } = useLingui()
  return (
    <footer className="flex-shrink-0 w-full mt-8 sm:mt-0">
      <div className="flex flex-col items-center justify-center h-20 px-4 gap-2">
        <div>&copy; 2022 All rights reserved</div>
        <div>
          Audited by <a href="#">audit firm</a>
        </div>
        <div className="flex sm:hidden items-center gap-4">
          <a href="#">
            <Image src="/images/socials/telegram.png" width={32} height={32} />
          </a>
          <a href="#">
            <Image src="/images/socials/twitter.png" width={32} height={32} />
          </a>
          <a href="#">
            <Image src="/images/socials/medium.png" width={32} height={32} />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
