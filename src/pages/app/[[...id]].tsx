import { useRouter } from 'next/router';
import React, { FC, useState } from 'react';
import type { GetServerSidePropsContext } from 'next';
import { Pane, Dialog, majorScale } from 'evergreen-ui';
import { getSession, useSession } from 'next-auth/react';

import Logo from 'components/logo';
import User from 'components/user';
import DocPane from 'components/docPane';
import FolderList from 'components/folderList';
import FolderPane from 'components/folderPane';
import NewFolderButton from 'components/newFolderButton';
import NewFolderDialog from 'components/newFolderDialog';
import { folder, doc, getDatabase } from 'db';

import type { Doc, Folder } from 'types/types';
import type { Session } from 'next-auth';

type pageProps = { folders?: Folder[]; activeFolder?: Folder; activeDoc?: Doc; activeDocs?: Doc[] };

function App({ folders, activeDoc, activeFolder, activeDocs }: pageProps) {
  const router = useRouter();
  const [newFolderIsShown, setIsShown] = useState(false);
  const [allFolders, setAllFolders] = useState(folders || []);
  const { status } = useSession();

  async function handleNewFolder(name: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/folder`, {
      method: 'POST',
      body: JSON.stringify({ name }),
      headers: { 'Content-Type': 'application/json' },
    });
    console.log(res);
    const data = await res.json();

    setAllFolders((prev) => [...prev, data]);
  }

  function renderPage() {
    if (activeDoc) return <DocPane folder={activeFolder} doc={activeDoc} />;

    if (activeFolder) return <FolderPane folder={activeFolder} docs={activeDocs} />;

    return null;
  }

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
          <FolderList folders={allFolders} />
        </Pane>
      </Pane>
      <Pane marginLeft={300} width="calc(100vw - 300px)" height="100vh" overflowY="auto" position="relative">
        <User />
        {renderPage()}
      </Pane>
      <NewFolderDialog close={() => setIsShown(false)} isShown={newFolderIsShown} onNewFolder={handleNewFolder} />
    </Pane>
  );
}

const getFolders = folder.getFolders;
const getDocsByFolder = doc.getDocsByFolder;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const caughtIds = context.params.id;
  const session = (await getSession(context)) as Session & { user?: { id: string } };

  if (!session) return { redirect: { destination: '/', permanant: false } };

  let activeDoc: Doc = null;
  let activeDocs: Doc[] = null;
  let activeFolder: Folder = null;
  const db = await getDatabase();
  const folders = await getFolders(db, session.user.id);

  if (caughtIds?.length) {
    activeFolder = folders.find((f) => f._id === caughtIds[0]);
    activeDocs = await getDocsByFolder(db, activeFolder._id);
  }

  if (caughtIds?.length > 1) activeDoc = activeDocs.find((doc) => doc._id === caughtIds[1]);

  return { props: { folders, activeFolder, activeDocs, activeDoc } };
}

export default App;
