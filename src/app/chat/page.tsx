import { ensureDefaultWorkspace, getConversations } from "./actions";
import { ChatInterface } from "./ChatInterface";

export default async function ChatPage() {
  const workspace = await ensureDefaultWorkspace();
  const initialConversations = await getConversations(workspace.id);

  return <ChatInterface initialConversations={initialConversations} workspaceId={workspace.id} />;
}
