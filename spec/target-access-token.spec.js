/**
 * Created by 4lk4t on 2017-05-29.
 */
const sinon = require('sinon')
const AccessToken = require('../src/helpers/target-access-token').TargetAccessToken

describe('It should get an access token', () => {
  let server
  let account
  let accessToken
  let token1, token2
  let spy

  beforeAll(() => {
    server = sinon.fakeServer.create()
    account = {
      name: 'test',
      tenant: 'test',
      apiKey: 'test',
      clientSecret: 'test',
      iss: 'test',
      sub: 'test',
      aud: 'test',
      pem: '-----BEGIN RSA PRIVATE KEY-----\nMIIEpgIBAAKCAQEA1itq3vt/rUV890UHIuH9F6KejMBY97Sx1VREjDj8WE3fqGFs\nCEf7dePXMgewMSQBDFi5mOKzM0eLWqSEvmSXlOQk6UChK8gSStzdKbVeHgoQZVEz\nRMk6ayBhEz6ecBDd8TGQ4pE//wc4SIcGZCTF+uka8+sXi060OseDK4OlgomVuKSV\n7lOhfi/kjkdg66PUHjUveVJU9vgEhLwouzc17Nm7MgPXZ1VH5s5P4RNt7buGlF1T\n5fxRmlGFKKjgcB/iBqM3uv8e8+QANvJdrsBsIlGLQ/9zkx1HxcPuWw+UZYejJwMT\nHuXNI/eQbVMvd5qidKtpVpfATmgQKh6nUcHEaQIDAQABAoIBAQCMmH4VGgdsKVTr\nQt53cOHkdTYecls1aeLgh+xkHTjTg3PTJvlzykVy0/q+djudVuR1RX25twErJcl+\n3Mfj8UdtUARHN81WX4ZarPlnWxAJKlQvHwpIGs4F64Cu0InUSc5Ze0+A3RelBQlW\n24U/ksCBgivWeru/ERDSEY2zsD2kHhheuaL9aQ+q6b8A6d06EM2WGQn58ABwJ1Bj\nMGeAgpstzmrQO4qcSF3HcNHsXQeYlCtIErQ8fyAK1ZtoctrDZvqk7bI8wo+9tyxj\nEcBD8wiAlWPmCIuS6AkLKO3TJ15x3WBl0eCP/ERLWsMCNJeQi7u0l4fHXnx9s0Zz\nJj2VRhe9AoGBAPZYhk9U/WyQP9n1Le9DMMxR5nu4ojCpXXm3YwTvShPqqiBvdK9x\nOvxYlaJBd/4zo2fTXn1+EDI7gcLXG6V5n8Y2lWVtbo9fBZi2mmxsGHMNTyeXOu5x\nMxupMiIkP7Gy1gvy0GB8wVZcF0Pdg1h2HPn2X1gcZb3sDE12aXkvoJ97AoGBAN6Q\nFWlZNcJf0vTw4pHFsF/NvmIMlxzSmzwzmXhtpJ/QOsaIU9CL49BTbEDYRzXJAdAy\nTqWqcdKclXHSjwarij3ifGs5HuIcUOrVxXAd4aiTo2/9TvA6tkShs6q8uPekRvWo\navMfpC+FrDhHAZ2UH1msdUz7G88/BV3/GZZWhJRrAoGBAOg9HKG9pgyrEQcRtXRT\nC7YToA4TShRGFvGgiaElVdjg6fIaIQ8k2E791FNbFRx44hwHkJUOO4afwv1EfbPK\nrW3YF4+/UvOmyUfnHj4IyiPs8CqKz+vqnBv/rluxgLqttk0dZIUSF9KqjuRT+Hd1\nImwkcE5It0INPqvobhbpZ6vxAoGBAJdCu5qey9+v+pMISCQkhGuITHUc83LeXCy9\nMPfdJL6M6fVWYAhjmtBSckdb9oHCfB4Aot0LC1LFovf5z8ULvueyTzccWjX4YrJH\n2WkKlfxZYwHQ2d6BOLFKaO6IVvnPx35cGVvlTFQT+GlDMQDk063BfPN10n+26DHr\nF3vKj07DAoGBAIdWOMlTLW+Ys4GCvxI/D6sRC6x/44DUEbGKLh+5Sunp0dxJ1sEq\nhSCx5MEo2WAD8kd4pECZzmEslZ+V/Bsimlg0NQ4EyqU1XD1pb0JeEigOrDupqlIT\niXx2qWq+R/nfz354jmop1yea6GNy8T5oHo2axmIIdo75Fv2UVsuWIRAP\n-----END RSA PRIVATE KEY-----\n'
    }
    accessToken = new AccessToken(account)
    spy = sinon.spy()
  })
  afterAll(() => server.restore())

  beforeEach((done) => {
    let calls = 0
    const resolve = () => {
      calls++
      if (calls >= 2) done()
    }

    server.respondWith([200, {'Content-Type': 'application/json'},
      JSON.stringify({token: {test: 'test', expires_in: 100000}})]
    )

    accessToken.token.then((d) => {
      token1 = d
      spy()
      resolve()
    })
    accessToken.token.then((d) => {
      token2 = d
      spy()
      resolve()
    })
  })

  it('may only create one request', () => {
    expect(spy.calledOnce)
  })
  it('must return the same token twice', () => {
    expect(token1).toEqual(token2)
  })
})
