import { useRouter } from 'next/router';
import React, { FC, useState } from 'react';
import { Pane, Dialog, majorScale } from 'evergreen-ui';
import { getSession, useSession } from 'next-auth/react';

import Logo from 'components/logo';
import User from 'components/user';
import DocPane from 'components/docPane';
import FolderList from 'components/folderList';
import FolderPane from 'components/folderPane';
import NewFolderButton from 'components/newFolderButton';
import NewFolderDialog from 'components/newFolderDialog';

import type { GetServerSidePropsContext } from 'next';

type pageProps = { folders?: any[]; activeFolder?: any; activeDoc?: any; activeDocs?: any[] };

function App({ folders = [], activeDoc, activeFolder, activeDocs }: pageProps) {
  const router = useRouter();
  const [newFolderIsShown, setIsShown] = useState(false);
  const { status } = useSession();

  const renderPage = () => {
    if (activeDoc) return <DocPane folder={activeFolder} doc={activeDoc} />;

    if (activeFolder) return <FolderPane folder={activeFolder} docs={activeDocs} />;

    return null;
  };

  if (status === 'loading') return null;

  if (status === 'unauthenticated') {
    return (
      <Dialog
        isShown
        title="Session expired"
        confirmLabel="Ok"
        hasCancel={false}
        hasClose={false}
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEscapePress={false}
        onConfirm={() => router.push('/auth/signin')}
      >
        Sign in to continue
      </Dialog>
    );
  }

  return (
    <Pane position="relative">
      <Pane width={300} position="absolute" top={0} left={0} background="tint2" height="100vh" borderRight>
        <Pane padding={majorScale(2)} display="flex" alignItems="center" justifyContent="space-between">
          <Logo />

          <NewFolderButton onClick={() => setIsShown(true)} />
        </Pane>
        <Pane>
          <FolderList folders={folders} />{' '}
        </Pane>
      </Pane>
      <Pane marginLeft={300} width="calc(100vw - 300px)" height="100vh" overflowY="auto" position="relative">
        <User />
        {renderPage()}
      </Pane>
      <NewFolderDialog close={() => setIsShown(false)} isShown={newFolderIsShown} onNewFolder={() => {}} />
    </Pane>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (!session) return { redirect: { destination: '/', permanant: false } };

  return { props: {} };
}

export default App;
