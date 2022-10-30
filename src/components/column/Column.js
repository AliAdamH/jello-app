import React from 'react';
import styled from 'styled-components';
import Card from '../card/Card';
import { Droppable, Draggable } from '@hello-pangea/dnd';
const Container = styled.div`
  border: 1px solid lightgray;
  border-radius: 0.375rem;
  width: 320px;
  background-color: #eee;
  display: flex;
  flex-direction: column;
`;
const Title = styled.h3`
  padding: 0.75rem;
  margin: 0;
  background-color: #eee;
`;
const TaskList = styled.div`
  min-height: 1rem;
  flex: 1;
  padding: 0.5rem;
  transition: background-color 0.2s ease;
  background-color: ${(props) => (props.isDraggingOver ? 'skyblue' : '#eee')};
`;

const Footer = styled.div`
  padding: 0.2rem;
  background-color: #eee;
  display: flex;
`;

const NewCardButton = styled.button`
  padding: 0.3rem;
  border-radius: 0.25rem;
  flex: 1;
  text-align: start;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #ddd;
  }
`;

const MiscButton = styled.button`
  padding-block: 0.3rem;
  padding-inline: 0.4rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #ddd;
  }
`;

const Column = (props) => {
  return (
    <>
      <Draggable draggableId={props.column.id} index={props.index}>
        {(provided) => (
          <Container ref={provided.innerRef} {...provided.draggableProps}>
            <Title {...provided.dragHandleProps}>{props.column.title}</Title>
            <Droppable type="task" droppableId={props.column.id}>
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
            <Footer>
              <NewCardButton>+ Add a new card</NewCardButton>
              <MiscButton> &#9883; </MiscButton>
            </Footer>
          </Container>
        )}
      </Draggable>
    </>
  );
};

export default Column;
