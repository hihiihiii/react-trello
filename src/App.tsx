import styled from "styled-components";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import { todoState } from "./atoms";
import Board from "./Components/Board";

const Wrapper = styled.div`
  display: flex;
  width: 100vw;
  margin: 0px auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Boards = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  gap: 10px;
`;

const App = () => {
  const [todos, setTodos] = useRecoilState(todoState);
  const onDragEnd = (info: DropResult) => {
    const { destination, source, draggableId } = info;
    console.log(source);

    if (!destination) return;
    if (source.droppableId === destination?.droppableId) {
      setTodos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        const taskObj = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
      });
    }

    if (source.droppableId !== destination?.droppableId) {
      setTodos((allBoard) => {
        const sourceBoard = [...allBoard[source.droppableId]];
        const taskObj = sourceBoard[source.index];
        const droppableBoard = [...allBoard[destination.droppableId]];

        sourceBoard.splice(source.index, 1);
        droppableBoard.splice(destination?.index, 0, taskObj);

        return {
          ...allBoard,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: droppableBoard,
        };
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Boards>
          {/* object loop */}
          {Object.keys(todos).map((boardId) => (
            <Board
              key={boardId}
              boardId={boardId}
              todos={todos[boardId]}
            ></Board>
          ))}
        </Boards>
      </Wrapper>
    </DragDropContext>
  );
};

export default App;
