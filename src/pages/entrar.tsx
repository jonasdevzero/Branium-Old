import { useState, useEffect } from "react"
import Head from "next/head"
import Link from "next/link"
import Image from "next/image"
import Router from "next/router"
import { parseCookies } from "nookies"
import userService from "../services/api/userService"
import { constant } from "../constant"


import { Header, Footer, Loading, CpuAnimation } from "../components"
import {
  Container,
  Content,
  Form,
  Title,
  ErrorMessage,
  InputWrapper,
  Label,
  Input,
  Submit,
  Links,
  RedirectLink
} from "../styles/utils/FormPage"

export default function Entrar() {
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")

  const [loadingRequest, setLoadingRequest] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string>()
  const [color, setColor] = useState<"green" | "red">("green")

  useEffect(() => {
    const { ["branium.jwt"]: jwt } = parseCookies(null)
    if (jwt) {
      setSuccess(true)
      Router.replace(constant.routes.chat.HOME)
    };

    Router.query?.error ? setError(Router.query.error.toString()) : null
    return () => { }
  }, [])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setError(undefined)
    setLoadingRequest(true)
    setColor("green")
    userService.login({ login, password })
      .then(() => {
        setSuccess(true)
        Router.push(constant.routes.chat.HOME)
      })
      .catch(message => {
        setError(message)
        setColor("red")
        setTimeout(() => setColor("green"), 600)
      })
      .then(() => setLoadingRequest(false))
  }

  return (
    <Container>
      <Head>
        <title>Branium | Entrar</title>
      </Head>

      {success ? (<Loading hide={false} />) : (
        <>
          <Header links={false} />

          <Content>
            <Form onSubmit={handleSubmit}>
              <Title>Entrar</Title>

              {error && <ErrorMessage>{error}</ErrorMessage>}

              <InputWrapper>
                <Label htmlFor="login">Username / E-mail</Label>
                <Input id="login" type="text" value={login} onChange={e => setLogin(e.target.value)} />
              </InputWrapper>

              <InputWrapper>
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
              </InputWrapper>

              <Submit type="submit">
                {!loadingRequest ? "Entrar" : (<Image src="/images/loading-light.svg" width={30} height={30} alt="loading" />)}
              </Submit>

              <Links>
                <Link href={constant.routes.SIGN_UP} passHref>
                  <RedirectLink>Não é um membro?</RedirectLink>
                </Link>

                <Link href={constant.routes.RECOVER_PASSWORD} passHref>
                  <RedirectLink>Esqueceu a Senha?</RedirectLink>
                </Link>
              </Links>
            </Form>
          </Content>

          <Footer />
        </>)}

        <CpuAnimation color={color} />
    </Container>
  )
}
