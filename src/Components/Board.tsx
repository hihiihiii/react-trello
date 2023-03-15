import { Draggable, Droppable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import styled, { css } from "styled-components";
import { boardState, ITodo, todoState } from "../atoms";
import DraggableCard from "./DraggableCard";
import { AiOutlineClose } from "react-icons/ai";
import { useEffect, useRef, useState } from "react";

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
  position: relative;
  padding-top: 10px;
  min-width: 300px;
  border-radius: 5px;
  background-color: ${(props) => props.theme.boardColor};
  min-height: 200px;
  max-height: 100vh;
  overflow: hidden scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.24);
`;

const Title = styled.h2`
  flex: 1;
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
`;

const FormTop = styled.div`
  display: flex;
  padding: 15px 20px;
`;

const ToolDelete = styled.div`
  cursor: pointer;
`;

const Empty = styled.div`
  color: ${(props) => props.theme.cardTextColor};
`;

const FormTitleTop = styled.div<{ scrollTop: boolean }>`
  ${(props) =>
    props.scrollTop &&
    css`
      position: sticky;
      top: 0;
      left: 0;
      right: 0;
      backdrop-filter: blur(0.4rem);
      width: 300px;
    `}
`;

const Board = ({ todos, boardId, boardNum }: IBoardProps) => {
  const setTodos = useSetRecoilState(todoState);

  const { register, setValue, handleSubmit } = useForm<IForm>();
  const [scroll, setScroll] = useState<boolean>(false);

  // const formRef = useRef<any>(null);
  // useEffect(() => {
  //   const handleScroll = (e) => {
  //     setScroll(true);
  //   };
  //   const myDomNode = formRef.current;
  //   myDomNode.addEventListener("scroll", handleScroll);

  //   return () => {
  //     myDomNode.removeEventListener("scroll", handleScroll);
  //   };
  // }, [scroll]);

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (e.currentTarget.scrollTop >= 1) {
      setScroll(true);
    } else {
      setScroll(false);
    }
  };

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
    <Wrapper onScroll={onScroll}>
      <FormTitleTop scrollTop={scroll}>
        <FormTop>
          <Title>{boardId}</Title>
          <ToolBox>
            <ToolDelete onClick={handleDeleteBoard}>
              <AiOutlineClose></AiOutlineClose>
            </ToolDelete>
          </ToolBox>
        </FormTop>
        <Form onSubmit={handleSubmit(onValid)}>
          <FormInput
            {...register("todo", { required: true })}
            type="text"
            placeholder={`${boardId}를 추가하세요.`}
          />
        </Form>
      </FormTitleTop>
      <Droppable droppableId={boardId}>
        {(magic, info) => {
          return (
            <Area
              isDraggingOver={info.isDraggingOver}
              isDraggingFromThis={Boolean(info.draggingFromThisWith)}
              ref={magic.innerRef}
              {...magic.droppableProps}
            >
              {todos.length < 1 ? <Empty>보드가 비어있습니다.</Empty> : <></>}
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
