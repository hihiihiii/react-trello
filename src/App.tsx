import styled from "styled-components";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import { boardState, todoState } from "./atoms";
import Board from "./Components/Board";
import { AiFillFolderAdd, AiTwotoneDelete } from "react-icons/ai";
import { MdDarkMode, MdOutlineWbSunny } from "react-icons/md";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 100px;
  padding-left: 50px;
  margin: 0px auto;
  justify-content: center;
  align-items: flex-start;
`;

const Boards = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  overflow-x: scroll;
  gap: 10px;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const AddBoard = styled.div`
  width: 100px;
  height: 50px;
  position: absolute;
  font-size: 36px;
  top: 20px;
  right: 20px;
  cursor: pointer;
  z-index: 1;
  &:hover {
    transition: 0.5s all ease-in-out;
    color: #3498db;
  }
`;

const KanBanTitle = styled.h1`
  color: #fff;
  font-size: 32px;
  margin-bottom: 20px;
  font-weight: bold;
`;

export const TrashWrapper = styled.div`
  position: absolute;
  top: -75px;
  width: 100px;
  height: 75px;
  border-bottom-left-radius: 50px;
  border-bottom-right-radius: 50px;
  background-color: #e74c3c;
  left: 50%;
  transform: translate(-50%, 0%);
`;

const TrashIcon = styled.div`
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 30px;
`;

const App = () => {
  const [todos, setTodos] = useRecoilState(todoState);
  const [boards, setBoards] = useRecoilState(boardState);

  //보드 추가
  const handleAddBoard = () => {
    const boardName = window.prompt("보드이름을 입력하세요.");
    setTodos((allBoards) => {
      return {
        ...allBoards,
        [String(boardName)]: [],
      };
    });

    setBoards((allBoards) => {
      return [...allBoards, String(boardName)];
    });
  };

  const onDragEnd = (info: DropResult) => {
    const { destination, source, draggableId } = info;
    if (!destination) return;

    if (source.droppableId === "boards") {
      setBoards((prev) => {
        const boardCopy = [...prev];
        const item = boardCopy.splice(source.index, 1)[0];
        console.log(item);
        boardCopy.splice(destination.index, 0, item);
        return boardCopy;
      });
    } else if (destination?.droppableId === "trashCan") {
      setTodos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        boardCopy.splice(source.index, 1);
        return { ...allBoards, [source.droppableId]: boardCopy };
      });
    } else if (source.droppableId === destination?.droppableId) {
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
    } else if (source.droppableId !== destination?.droppableId) {
      setTodos((allBoard) => {
        const sourceBoard = [...allBoard[source.droppableId]];
        const taskObj = sourceBoard[source.index];
        const droppableBoard = [...allBoard[destination?.droppableId]];
        sourceBoard.splice(source.index, 1);
        droppableBoard.splice(destination?.index, 0, taskObj);

        return {
          ...allBoard,
          [source.droppableId]: sourceBoard,
          [destination?.droppableId]: droppableBoard,
        };
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Droppable droppableId="trashCan">
          {(magic, info) => {
            return (
              <TrashWrapper ref={magic.innerRef} {...magic.droppableProps}>
                <TrashIcon>
                  <AiTwotoneDelete></AiTwotoneDelete>
                </TrashIcon>
                {magic.placeholder}
              </TrashWrapper>
            );
          }}
        </Droppable>
        {/* <MdDarkMode></MdDarkMode>
          <MdOutlineWbSunny></MdOutlineWbSunny> */}
        <KanBanTitle>KanBoard</KanBanTitle>

        <AddBoard>
          <AiFillFolderAdd onClick={handleAddBoard}></AiFillFolderAdd>
        </AddBoard>

        <Droppable droppableId="boards" type="board">
          {(magic) => {
            return (
              <Boards ref={magic.innerRef} {...magic.droppableProps}>
                {/* object loop */}
                {Object.keys(todos).map((boardId, index) => (
                  <Board
                    key={boardId}
                    todos={todos[boardId]}
                    boardId={boardId}
                    boardNum={index}
                  ></Board>
                ))}
                {magic.placeholder}
              </Boards>
            );
          }}
        </Droppable>
      </Wrapper>
    </DragDropContext>
  );
};

export default App;
