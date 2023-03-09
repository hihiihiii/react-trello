import { useRef } from "react";
import { Droppable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { ITodo, todoState } from "../atoms";
import DraggableCard from "./DraggableCard";

interface IBoardProps {
  todos: ITodo[];
  boardId: string;
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
  width: 300px;
  border-radius: 5px;
  background-color: ${(props) => props.theme.boardColor};
  min-height: 200px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 10px;
  font-weight: 400;
  font-size: 24px;
`;

//isDraggingFromThis 드래그가 떠날 때 발생하는 props.
const Area = styled.div<IAreaProps>`
  background-color: ${(props) =>
    props.isDraggingOver
      ? "#ededed"
      : props.isDraggingFromThis
      ? "#b2bec3"
      : "transparent"};
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
`;

const Board = ({ todos, boardId }: IBoardProps) => {
  const setTodos = useSetRecoilState(todoState);
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

  return (
    <Wrapper>
      <Title>{boardId}</Title>
      <Form onSubmit={handleSubmit(onValid)}>
        <FormInput
          {...register("todo", { required: true })}
          type="text"
          placeholder={`할 일을 추가하세요.`}
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
