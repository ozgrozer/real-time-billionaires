import axios from 'axios'
import Head from 'next/head'
import Image from 'next/image'

import shimmer from '@components/functions/shimmer'
import styles from '@components/styles/components/homepage.module.scss'

const numberFormat = (number, decimals, decimalSeparator, thousandsSeparator) => {
  if (number == null || !isFinite(number)) {
    throw new TypeError('number is not valid')
  }

  if (!decimals) {
    const len = number.toString().split('.').length
    decimals = len > 1 ? len : 0
  }

  if (!decimalSeparator) {
    decimalSeparator = '.'
  }

  if (!thousandsSeparator) {
    thousandsSeparator = ','
  }

  number = parseFloat(number).toFixed(decimals)
  number = number.replace('.', decimalSeparator)

  const splitNum = number.split(decimalSeparator)
  splitNum[0] = splitNum[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator)
  number = splitNum.join(decimalSeparator)

  return number
}

export default ({ billionaires }) => {
  return (
    <>
      <Head>
        <title>Real Time Billionaires</title>
      </Head>

      <div className={styles.billionaires}>
        {
          billionaires.map((billionaire, key) => {
            const _imageUrl = billionaire.squareImage || ''
            const imageUrl = _imageUrl.substr(0, 2) === '//'
              ? `https:${_imageUrl}`
              : _imageUrl

            return (
              <div key={key} className={styles.billionaire}>
                <div className={styles.image}>
                  {
                    imageUrl
                      ? (
                        <Image
                          width={50}
                          height={50}
                          src={imageUrl}
                          placeholder='blur'
                          blurDataURL={shimmer()}
                        />
                        )
                      : (
                        <div className={styles.noImage} />
                        )
                  }
                </div>

                <div className={styles.rank}>
                  {billionaire.rank}
                </div>

                <div className={styles.fullName}>
                  {billionaire.personName}
                </div>

                <div className={styles.worth}>
                  ${numberFormat((billionaire.finalWorth / 1000), 2)} B
                </div>

                <div className={styles.source}>
                  {billionaire.source}
                </div>

                <div className={styles.country}>
                  {billionaire.countryOfCitizenship}
                </div>
              </div>
            )
          })
        }
      </div>
    </>
  )
}

export const getStaticProps = async () => {
  const apiResult = await axios.get('https://www.forbes.com/forbesapi/person/rtb/0/-estWorthPrev/true.json?fields=squareImage,rank,personName,finalWorth,birthDate,source,countryOfCitizenship')
  const billionaires = apiResult.data.personList.personsLists.filter((item, key) => key < 200)

  return {
    revalidate: 10,
    props: { billionaires }
  }
}
