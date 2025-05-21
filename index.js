addEventListener('fetch', event => {
  event.respondWith(handle(event.request))
})

async function handle(request) {
  // rewrite to the real Streamlit app
  let url = new URL(request.url)
  url.hostname = 'econchat.streamlit.app'
  url.search    = '?embed=true'  // keep embed true

  let resp = await fetch(url.toString(), request)

  // copy headers and remove the ones that block framing
  let headers = new Headers(resp.headers)
  headers.delete('x-frame-options')
  headers.delete('content-security-policy')

  // re-serve
  return new Response(resp.body, {
    status:      resp.status,
    statusText:  resp.statusText,
    headers:     headers
  })
}
