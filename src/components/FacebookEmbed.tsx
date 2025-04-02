'use client'

import { useEffect } from 'react'

const FacebookEmbed = () => {
  useEffect(() => {
    const loadFacebookSDK = () => {
      return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script')
        script.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v22.0'
        script.async = true
        script.defer = true
        script.onload = () => {
          if (window.FB) {
            resolve()
          } else {
            reject('Facebook SDK Failed to load')
          }
        }
        script.onerror = () => {
          reject('failed to load facebook SDK')
        }
        document.body.appendChild(script)
      })
    }

    const initializeFacebookEmbed = async () => {
      try {
        await loadFacebookSDK()
        setTimeout(() => {
          if (window.FB) {
            window.FB.XFBML.parse()
          }
        }, 1000)
      } catch (error) {
        console.error('error loading facebook sdk', error)
      }
    }

    initializeFacebookEmbed()

    return () => {
      const script = document.querySelector(
        'script[src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v22.0"]'
      )
      if (script) {
        document.body.removeChild(script)
      }
    }
  }, [])

  return (
    <div>
      <div id="fb-root"></div>
      <div
        className="fb-page"
        data-href="https://www.facebook.com/profile.php?id=100068667966462"
        data-tabs="timeline"
        data-width="500"
        data-height="500"
        data-small-header="false"
        data-adapt-container-width="true"
        data-hide-cover="false"
        data-show-facepile="true"
      >
        <blockquote
          cite="https://www.facebook.com/profile.php?id=100068667966462"
          className="fb-xfbml-parse-ignore"
        >
          <a href="https://www.facebook.com/profile.php?id=100068667966462">Late Night BBQ</a>
        </blockquote>
      </div>
    </div>
  )
}

export default FacebookEmbed
