import React, { useEffect, useState } from 'react'
import Modal from '../../components/Modal'
import ModalHeader from '../../components/ModalHeader'
import Datetime from 'react-datetime'
import * as moment from 'moment'
import { ButtonError } from '../../components/Button'
import { AutoRow } from '../../components/Row'
import Loader from '../../components/Loader'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

interface ExtendLockModalProps {
  isOpen: boolean
  onDismiss: () => void
  title: string
  lockId: string
  currentDate: any
  extend: (id: any, duration: any) => Promise<void>
}

export default function ExtendLockModal({
  isOpen,
  onDismiss,
  title,
  lockId,
  currentDate,
  extend,
}: ExtendLockModalProps) {
  const [unlockDate, setUnlockDate] = useState(new Date())

  useEffect(() => {
    if (isOpen == false) {
      setUnlockDate(new Date())
    }
  }, [isOpen])

  const errorMessage =
    !moment.isDate(unlockDate) ||
    moment.default(unlockDate).isBefore(new Date()) ||
    moment.default(unlockDate).isBefore(moment.unix(currentDate))
      ? 'Invalid unlock date'
      : ''

  const allInfoSubmitted = errorMessage == ''

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxWidth={672} overflow_y={'visible'}>
      <ModalHeader onClose={onDismiss} title={title} />
      <div className="grid grid-flow-row-dense grid-cols-1 gap-3 overflow-y-visible mt-4">
        <div className="flex flex-col justify-between space-y-3 sm:space-y-0 sm:flex-row">
          <div className={'flex justify-center'}>
            <div className="flex flex-1 flex-col items-start mt-2 md:mt-0 justify-center mx-3.5">
              <div className="text-base font-medium text-primary-text whitespace-nowrap">Unlock date</div>
            </div>
          </div>
          <div className={'flex items-center w-full space-x-3 rounded bg-primary-bg focus:bg-dark-700 p-3'}>
            <>
              <DatePicker
                selected={unlockDate}
                onChange={(date: React.SetStateAction<Date>) => {
                  setUnlockDate(date)
                }}
                showPopperArrow={false}
                showTimeInput
                minDate={new Date()}
                dateFormat="MM/dd/yyyy h:mm aa"
                className="p-3 w-full flex overflow-ellipsis font-bold recipient-address-input bg-primary-bg h-full w-full rounded placeholder-low-emphesis"
              />
            </>
          </div>
        </div>

        <div className={'px-8 py-2'}>
          <div className="flex flex-col justify-between space-y-3 sm:space-y-0 sm:flex-row">
            <div className={'flex items-center w-full'}>
              {!allInfoSubmitted ? (
                <ButtonError className="font-bold" style={{ width: '100%' }} disabled={!allInfoSubmitted}>
                  {errorMessage}
                </ButtonError>
              ) : (
                <ButtonError
                  className="font-bold text-light"
                  onClick={() => {
                    extend(lockId, unlockDate)
                  }}
                  style={{
                    width: '100%',
                  }}
                  disabled={false}
                >
                  {false ? (
                    <div className={'p-2'}>
                      <AutoRow gap="6px" justify="center">
                        Extending Lock <Loader stroke="white" />
                      </AutoRow>
                    </div>
                  ) : (
                    `Extend Lock Duration`
                  )}
                </ButtonError>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
