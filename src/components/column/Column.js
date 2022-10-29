import React from 'react';
import styled from 'styled-components';
import Card from '../card/Card';
import { Droppable } from '@hello-pangea/dnd';
const Container = styled.div`
  border: 1px solid lightgray;
  border-radius: 0.375rem;
  width: 320px;
  background-color: white;
  display: flex;
  flex-direction: column;
`;
const Title = styled.h3`
  padding: 0.75rem;
  margin: 0;
  background-color: #eee;
`;
const TaskList = styled.div`
  min-height: 32px;
  flex: 1;
  padding: 0.5rem;
  transition: background-color 0.2s ease;
  background-color: ${(props) => (props.isDraggingOver ? 'skyblue' : 'white')};
`;
const Column = (props) => {
  return (
    <>
      <Container>
        <Title>{props.column.title}</Title>
        <Droppable droppableId={props.column.id}>
          {(provided, snapshot) => (
            <TaskList
              ref={provided.innerRef}
              {...provided.droppableProps}
              isDraggingOver={snapshot.isDraggingOver}
            >
              {props.tasks.map((task, index) => (
                <Card key={task.id} task={task} index={index} />
              ))}
              {provided.placeholder}
            </TaskList>
          )}
        </Droppable>
      </Container>
    </>
  );
};

export default Column;
