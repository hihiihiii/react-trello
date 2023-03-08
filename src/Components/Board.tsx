import { useRef } from "react";
import { Droppable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { ITodo } from "../atoms";
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
  width: 100%;
  input {
    width: 100%;
    box-sizing: border-box;
  }
`;

const Board = ({ todos, boardId }: IBoardProps) => {
  const { register, setValue, handleSubmit } = useForm<IForm>();

  const onValid = (data: IForm) => {
    setValue("todo", "");
  };

  return (
    <Wrapper>
      <Title>{boardId}</Title>
      <Form onSubmit={handleSubmit(onValid)}>
        <input
          {...register("todo", { required: true })}
          type="text"
          placeholder={`Add task on ${boardId}`}
        />
      </Form>
      <Droppable droppableId={boardId}>
        {/* Droppable의 children은 함수여야 */}
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
                  //draggable 아이디와 key는 같아야 한다.
                  <DraggableCard
                    key={todo.id}
                    todoId={todo.id}
                    todoText={todo.text}
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
