import { useRef } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { boardState, ITodo, todoState } from "../atoms";
import DraggableCard from "./DraggableCard";
import { AiOutlineClose } from "react-icons/ai";
import { RxHamburgerMenu } from "react-icons/rx";

interface IBoardProps {
  todos: ITodo[];
  boardId: string;
  boardNum: number;
}

interface IAreaProps {
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}

interface IForm {
  todo: string;
}
const Wrapper = styled.div`
  padding-top: 30px;
  padding-top: 10px;
  min-width: 300px;
  border-radius: 5px;
  background-color: ${(props) => props.theme.boardColor};
  min-height: 200px;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 10px;
  font-weight: 400;
  font-size: 24px;
  color: ${(props) => props.theme.cardTextColor};
`;

//isDraggingFromThis 드래그가 떠날 때 발생하는 props.
const Area = styled.div<IAreaProps>`
  background-color: ${(props) =>
    props.isDraggingOver ? "#ededed" : "transparent"};
  flex-grow: 1;
  transition: 0.3s ease-in-out;
  padding: 20px;
`;

const Form = styled.form`
  padding: 0px 20px;
`;

const FormInput = styled.input`
  box-sizing: border-box;
  border-radius: 5px;
  width: 100%;
  padding: 10px;
  border: none;
  font-size: 16px;
  background-color: ${(props) => props.theme.cardColor};
`;

const ToolBox = styled.div`
  display: flex;
  position: absolute;
  right: 10px;
`;

const ToolDelete = styled.div`
  cursor: pointer;
`;

const Board = ({ todos, boardId, boardNum }: IBoardProps) => {
  const setTodos = useSetRecoilState(todoState);
  const setBoards = useSetRecoilState(boardState);
  const { register, setValue, handleSubmit } = useForm<IForm>();

  const onValid = ({ todo }: IForm) => {
    const newTodo = {
      id: Date.now(),
      text: todo,
    };

    setTodos((allBoard) => {
      return {
        ...allBoard,
        [boardId]: [...allBoard[boardId], newTodo],
      };
    });

    setValue("todo", "");
  };

  const handleDeleteBoard = () => {
    setTodos((allBoard) => {
      const boardCopy = { ...allBoard };
      delete boardCopy[boardId];
      return boardCopy;
    });
  };

  return (
    <Wrapper>
      <Title>{boardId}</Title>
      <ToolBox>
        <ToolDelete onClick={handleDeleteBoard}>
          <AiOutlineClose></AiOutlineClose>
        </ToolDelete>
      </ToolBox>
      <Form onSubmit={handleSubmit(onValid)}>
        <FormInput
          {...register("todo", { required: true })}
          type="text"
          placeholder={`${boardId}를 추가하세요.`}
        />
      </Form>
      <Droppable droppableId={boardId}>
        {(magic, info) => {
          return (
            <Area
              isDraggingOver={info.isDraggingOver}
              isDraggingFromThis={Boolean(info.draggingFromThisWith)}
              ref={magic.innerRef}
              {...magic.droppableProps}
            >
              {todos.map((todo, index) => {
                return (
                  <DraggableCard
                    key={todo.id}
                    todoId={todo.id}
                    todoText={todo.text}
                    boardId={boardId}
                    index={index}
                  ></DraggableCard>
                );
              })}
              {magic.placeholder}
            </Area>
          );
        }}
      </Droppable>
    </Wrapper>
  );
};

export default Board;
