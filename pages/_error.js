import React from 'react'
import Error from 'next/error'
import {margin} from 'polished'
import {useTranslation} from 'react-i18next'
import Router from 'next/router'
import Layout from '../shared/components/layout'
import theme, {rem} from '../shared/theme'
import {PrimaryButton} from '../shared/components/button'

// eslint-disable-next-line react/prop-types
function MyError({statusCode, hasGetInitialPropsRun, err}) {
  if (!hasGetInitialPropsRun && err) {
    // getInitialProps is not called in case of
    // https://github.com/zeit/next.js/issues/8592. As a workaround, we pass
    // err via _app.js so it can be captured
    console.error(err)
  }

  const {t} = useTranslation()

  return (
    <Layout>
      <article>
        <div>{t('Something went wrong')}</div>
        <div>
          <section>
            <h2>
              {statusCode
                ? `An error ${statusCode} occurred on server`
                : t('An error occurred on client')}
            </h2>
            <div>
              <PrimaryButton onClick={() => Router.push('/home')}>
                {t('Go to My Idena')}
              </PrimaryButton>
            </div>
          </section>
        </div>
        <style jsx>{`
          article {
            background: ${theme.colors.darkGraphite};
            color: white;
            display: flex;
            flex-direction: column;
            height: 100vh;
            max-height: 100vh;
          }
          div:first-child {
            background: rgb(255, 102, 102);
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: ${rem(20, 13)};
            padding: ${rem(12, 13)};
            position: relative;
            text-align: center;
          }
          div:nth-child(2) {
            display: flex;
            align-items: center;
            justify-content: center;
            flex: 1;
          }
          h2 {
            font-size: ${rem(18)};
            font-weight: 500;
            margin: ${margin(0, 0, rem(40))};
            word-break: break-all;
          }
          section > div:nth-child(2) > section {
            background: rgb(255, 102, 102);
            border-radius: ${rem(9)};
            font-size: ${rem(14, 13)};
            line-height: ${rem(20, 13)};
            margin-top: ${rem(40)};
            padding: ${rem(18)} ${rem(24)};
            max-width: ${rem(480)};
          }
        `}</style>
      </article>
    </Layout>
  )
}

MyError.getInitialProps = async ({res, err, asPath}) => {
  const errorInitialProps = await Error.getInitialProps({res, err})

  // Workaround for https://github.com/zeit/next.js/issues/8592, mark when
  // getInitialProps has run
  errorInitialProps.hasGetInitialPropsRun = true

  if (res) {
    // Running on the server, the response object is available.
    //
    // Next.js will pass an err on the server if a page's `getInitialProps`
    // threw or returned a Promise that rejected

    if (res.statusCode === 404) {
      // Opinionated: do not record an exception in Sentry for 404
      return {statusCode: 404}
    }

    if (err) {
      console.error(err)

      return errorInitialProps
    }
  } else {
    // Running on the client (browser).
    //
    // Next.js will provide an err if:
    //
    //  - a page's `getInitialProps` threw or returned a Promise that rejected
    //  - an exception was thrown somewhere in the React lifecycle (render,
    //    componentDidMount, etc) that was caught by Next.js's React Error
    //    Boundary. Read more about what types of exceptions are caught by Error
    //    Boundaries: https://reactjs.org/docs/error-boundaries.html
    // eslint-disable-next-line no-lonely-if
    if (err) {
      console.error(err)

      return errorInitialProps
    }
  }

  // If this point is reached, getInitialProps was called without any
  // information about what the error might be. This is unexpected and may
  // indicate a bug introduced in Next.js, so record it in Sentry
  console.error(`_error.js getInitialProps missing data at path: ${asPath}`)

  return errorInitialProps
}

export default MyError
