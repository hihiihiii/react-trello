import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

const Card = styled.div<{ isDragging: boolean }>`
  padding: 10px;
  border-radius: 5px;
  background-color: ${(props) =>
    props.isDragging ? "#74b9ff" : props.theme.cardColor};
  margin-bottom: 5px;
  box-shadow: ${(props) =>
    props.isDragging ? "0px 10px 8px 0px rgba(0,0,0,0.4)" : "none"};
`;

interface IDragableCard {
  todoId: number;
  todoText: string;
  index: number;
}

const DraggableCard = ({ todoId, todoText, index }: IDragableCard) => {
  return (
    <Draggable draggableId={todoId + ""} index={index}>
      {(magic, info) => (
        <Card
          isDragging={info.isDragging}
          {...magic.dragHandleProps}
          {...magic.draggableProps}
          ref={magic.innerRef}
        >
          {todoText}
        </Card>
      )}
    </Draggable>
  );
};

export default React.memo(DraggableCard);
