import useGetIdentity from "@/hooks/auth/useGetIdentity";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { useEffect, useMemo, useState } from "react";

export const Cursor = ({ yProvider }: { yProvider: HocuspocusProvider }) => {
  const awareness = yProvider.awareness;
  const [users, setUsers] = useState<any>([]);
  const { identity } = useGetIdentity();

  useEffect(() => {
    const set = () => {
      if (!awareness) {
        return;
      }
      setUsers(Array.from(awareness.getStates()));
    };

    yProvider.awareness?.setLocalStateField("user", {
      name: identity.name,
      color: "#38A169", // TODO: support multiple client connections
    });

    yProvider.awareness?.on("change", set);
    set();

    return () => {
      awareness?.off("change", set);
    };
  }, [yProvider]);

  const styleSheet = useMemo(() => {
    let cursorStyles = "";
    for (let i = 0; i < users.length; i++) {
      const [clientId, client] = users[i];

      // TODO @didy: refactor to use chakra ui component
      if (client?.user) {
        cursorStyles += `
          .yRemoteSelection {
            opacity: 0.5;
            background-color: ${client.user.color};
            margin-right: -1px;
          }
          .yRemoteSelectionHead {
            position: absolute;
            box-sizing: border-box;
            height: 100 %;
            border-left: 2px solid ${client.user.color};
          }

          .yRemoteSelectionHead::after {
            position: absolute;
            top: -1.4em;
            left: -2px;
            padding: 2px 6px;
            background: ${client.user.color};
            color: #fff;
            border: 0;
            border-radius: 6px;
            border-bottom-left-radius: 0;
            line-height: normal;
            white-space: nowrap;
            font-size: 14px;
            font-family: var(--font-sans);
            font-style: normal;
            font-weight: 600;
            pointer-events: none;
            user-select: none;
            z-index: 1000;
          }

          .monaco-editor.overflow-guard > .margin,
          .monaco-editor.lines-content > * {
            top: 20px !important;
          }


          .yRemoteSelection-${clientId}, 
          .yRemoteSelectionHead-${clientId}  {
            --user-color: ${client.user.color};
          }

          .yRemoteSelectionHead-${clientId}::after {
            content: "${client.user.name}";
          }
        `;
      }
    }

    return { __html: cursorStyles };
  }, [users]);

  return <style dangerouslySetInnerHTML={styleSheet} />;
};
