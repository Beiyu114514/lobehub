import { Flexbox } from '@lobehub/ui';
import { memo } from 'react';

import { useAgentStore } from '@/store/agent';
import { builtinAgentSelectors } from '@/store/agent/selectors';
import { isDev } from '@/utils/env';

import { contextSelectors, useConversationStore } from '../../store';
import type { ChatItemProps } from '../type';

export interface ActionsProps {
  actionAddon?: ChatItemProps['actionAddon'];
  actions: ChatItemProps['actions'];
  placement?: ChatItemProps['placement'];
}

const Actions = memo<ActionsProps>(({ actionAddon, placement, actions }) => {
  const onboardingAgentId = useAgentStore(builtinAgentSelectors.webOnboardingAgentId);
  const conversationAgentId = useConversationStore(contextSelectors.agentId);
  if (!isDev && onboardingAgentId && conversationAgentId === onboardingAgentId) return null;

  const isUser = placement === 'right';
  return (
    <Flexbox
      align={'center'}
      direction={'horizontal'}
      gap={4}
      // The row is content-sized inside a flex-start column, so without a cap it
      // overflows its lane instead of yielding: on a narrow viewport the model +
      // token-usage cluster in `actions` would run past the right edge.
      style={{
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        maxInlineSize: '100%',
        minInlineSize: 0,
      }}
    >
      {!isUser && actionAddon}
      {actions && (
        // Let the action buttons and the usage cluster stack on two lines when
        // they don't fit side by side (mobile), rather than overflowing.
        <Flexbox
          horizontal
          align={'center'}
          role="menubar"
          style={{ flexWrap: 'wrap', minWidth: 0 }}
        >
          {actions}
        </Flexbox>
      )}
      {isUser && actionAddon}
    </Flexbox>
  );
});

export default Actions;
