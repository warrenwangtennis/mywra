addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

function getCookie(cookieString, key) {
  key += "="
  var ans = ""
  try {
    let allCookies = cookieString.split(";")
    allCookies.forEach(cookie => {
      cookie = cookie.trim()
      if (cookie.startsWith(key)) {
        ans = cookie.substring(key.length)
        return
      }
    });
  } catch (err) {
    return ""
  }
  return ans
}

async function handleRequest(request) {
  const url = "https://cfw-takehome.developers.workers.dev/api/variants"
  let response = await fetch(url)
  if (!response.ok) {
    return undefined
  }
  let json = await response.json()
  let urls = json.variants
  let idxCookie = getCookie(request.headers.get("cookie"), "idx")
  let idx = idxCookie === "0" ? 0 : idxCookie === "1" ? 1 : Math.round(Math.random())
  let response2 = await fetch(urls[idx])
  let text = await response2.text()
  if (text.includes("Variant 1")) {
    text = text.replace(/Variant 1/g, "Search Engine 1")
      .replace("This is variant one of the take home project!", "Go to DuckDuckGo!")
      .replace("https://cloudflare.com", "https://www.duckduckgo.com")
      .replace("Return to cloudflare.com", "DuckDuckGo")
  } else {
    text = text.replace(/Variant 2/g, "Search Engine 2")
      .replace("This is variant two of the take home project!", "Go to Bing!")
      .replace("https://cloudflare.com", "https://www.bing.com")
      .replace("Return to cloudflare.com", "Bing")
  }
  let ret = new Response(text, {
    status: response2.status,
    statusText: response2.statusText,
    headers: response2.headers
  })

  ret.headers.append("Set-Cookie", "idx="+idx+"; path=/")

  return ret
}
