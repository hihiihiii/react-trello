import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { AiOutlineDelete } from "react-icons/ai";
import { useRecoilState, useSetRecoilState } from "recoil";
import { todoState } from "../atoms";

const CardDeleteBox = styled.div`
  font-size: 18px;
  display: none;
`;

const Card = styled.div<{ isDragging: boolean }>`
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  background-color: ${(props) =>
    props.isDragging ? "#74b9ff" : props.theme.cardColor};
  margin-bottom: 5px;
  box-shadow: ${(props) =>
    props.isDragging ? "0px 10px 8px 0px rgba(0,0,0,0.4)" : "none"};

  &:hover {
    ${CardDeleteBox} {
      display: initial;
      color: red;
    }
  }
`;

const CardText = styled.span`
  flex: 1;
  font-size: 22px;
`;

interface IDragableCard {
  todoId: number;
  todoText: string;
  index: number;
  boardId: string;
}

const DraggableCard = ({ todoId, todoText, index, boardId }: IDragableCard) => {
  // const setTodos = useSetRecoilState(todoState);
  const [todos, setTodos] = useRecoilState(todoState);

  //일단 완성.
  const onDelete = () => {
    setTodos((allBoard) => {
      const boardCopy = [...allBoard[boardId]];
      const boardDelete = boardCopy.filter((board) => board.id !== todoId);
      return { ...allBoard, [boardId]: boardDelete };
    });
  };

  return (
    <Draggable draggableId={todoId + ""} index={index}>
      {(magic, info) => (
        <Card
          isDragging={info.isDragging}
          {...magic.dragHandleProps}
          {...magic.draggableProps}
          ref={magic.innerRef}
        >
          <CardText>{todoText}</CardText>
          <CardDeleteBox onClick={onDelete}>
            <AiOutlineDelete></AiOutlineDelete>
          </CardDeleteBox>
        </Card>
      )}
    </Draggable>
  );
};

export default React.memo(DraggableCard);
