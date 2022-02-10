import { useEffect, useMemo } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { authPage, useAuth, useAppSelector, useAppDispatch } from "~/hooks"
import { constant } from "~/constant"

import { Sidebar } from "~/components"
import { Header, Messages, Form, Members } from "~/components/Room/Group"
import { Container, Inner } from "~/styles/pages/branium"

export default function Contact() {
  const router = useRouter()
  const groups = useAppSelector(state => state.user.groups)
  const group = useMemo(() => groups.find(c => c.id === router.query.id), [router, groups])

  const { isAuthenticated } = useAuth()

  useEffect(() => {
    isAuthenticated && !group ? router.replace(constant.routes.chat.HOME) : null
  }, [group, router, isAuthenticated])

  return (
    <Container>
      <Head>
        <title>Branium | {group?.name}</title>
      </Head>

      <Sidebar />

      {group ? (
        <>
          <Inner>
            <Header group={group} />
            <Messages group={group} />
            <Form group_id={group.id} />
          </Inner>

          <Members group={group} />
        </>
      ) : null}
    </Container>
  )
}

export const getServerSideProps = authPage
