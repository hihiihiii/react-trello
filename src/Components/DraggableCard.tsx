import React, { useEffect } from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { AiOutlineDelete } from "react-icons/ai";
import { useRecoilState, useSetRecoilState } from "recoil";
import { todoState, trashState } from "../atoms";

const CardDeleteBox = styled.div`
  font-size: 18px;
  display: none;
  cursor: pointer;
`;

const Card = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  background-color: ${(props) => props.theme.cardColor};
  margin-bottom: 5px;

  &.dragging {
    box-shadow: 0 0.4rem 0.8rem rgba(0, 0, 0, 0.25);
  }

  &.dragging-over-trash {
    background-color: tomato !important;
    color: white;
  }

  &:hover {
    ${CardDeleteBox} {
      display: initial;
      color: red;
    }
  }
`;

const CardText = styled.span`
  flex: 1;
  font-size: 20px;

  color: ${(props) => props.theme.cardTextColor};
`;

interface IDragableCard {
  todoId: number;
  todoText: string;
  index: number;
  boardId: string;
}

const DraggableCard = ({ todoId, todoText, index, boardId }: IDragableCard) => {
  const [todos, setTodos] = useRecoilState(todoState);

  const onDelete = () => {
    setTodos((allBoard) => {
      const boardCopy = [...allBoard[boardId]];
      const boardDelete = boardCopy.filter((board) => board.id !== todoId);
      return { ...allBoard, [boardId]: boardDelete };
    });
  };

  return (
    <Draggable draggableId={todoId + ""} index={index}>
      {(magic, info) => {
        return (
          <Card
            className={`${info.isDragging ? "dragging" : ""} ${
              info.draggingOver === "trashCan" ? "dragging-over-trash" : ""
            }`}
            {...magic.dragHandleProps}
            {...magic.draggableProps}
            ref={magic.innerRef}
          >
            <CardText>{todoText}</CardText>
            <CardDeleteBox onClick={onDelete}>
              <AiOutlineDelete></AiOutlineDelete>
            </CardDeleteBox>
          </Card>
        );
      }}
    </Draggable>
  );
};

export default React.memo(DraggableCard);
