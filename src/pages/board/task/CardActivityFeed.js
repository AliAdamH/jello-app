import React from 'react';
import styled from 'styled-components';
import { FaChartBar, FaUser } from 'react-icons/fa';

const Activity = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
`;

const CommentActivity = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const CommentField = styled.input`
  padding-inline: 0.5rem;
  padding-block: 0.5rem;
  width: 100%;
  border: 1px solid lightgray;
  border-radius: 0.375rem;
`;

const ActivityUser = styled.div`
  height: 32px;
  width: 32px;
  border-radius: 50%;
  flex-shrink: 0;
  background-color: white;
  box-shadow: 0px 0px 0px 2px rgba(0, 0, 0, 0.1) inset;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ActivityText = styled.p`
  padding-inline: 0.5rem;
  font-size: 0.825rem;
  line-height: 1.5;
`;

function CardActivityFeed() {
  return (
    <>
      <h3
        style={{
          fontSize: '1.125rem',
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center',
        }}
      >
        {' '}
        <FaChartBar /> Activity
      </h3>
      <CommentActivity>
        <ActivityUser>
          <FaUser />
        </ActivityUser>
        <CommentField type={'text'} placeholder="Comment..." />
      </CommentActivity>
      <Activity>
        <ActivityUser>
          <FaUser />
        </ActivityUser>
        <ActivityText>
          Hello this is some fancy activity text we can even write very long
          text to see where it goes Hello this is some fancy activity text we
          can even write.
        </ActivityText>
      </Activity>

      <Activity>
        <ActivityUser>
          <FaUser />
        </ActivityUser>
        <ActivityText>
          Hello this is some fancy activity text we can even write very long
          text to see where it goes Hello this is some fancy activity text we
          can even write.
        </ActivityText>
      </Activity>
    </>
  );
}

export default CardActivityFeed;
