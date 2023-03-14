import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import { darkModeState, todoState } from "./atoms";
import Board from "./Components/Board";
import { AiFillFolderAdd, AiTwotoneDelete } from "react-icons/ai";
import { MdDarkMode, MdOutlineWbSunny } from "react-icons/md";
import { darkTheme, lightTheme } from "./styled/theme";

const TrashWrapper = styled.div`
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

const GlobalStyled = createGlobalStyle`
/* http://meyerweb.com/eric/tools/css/reset/ 
   v2.0 | 20110126
   License: none (public domain)
*/

html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed, 
figure, figcaption, footer, header, hgroup, 
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
	display: block;
}
body {
	line-height: 1.2;
	font-weight: 300;
	font-family: "Source Sans Pro", sans-serif;
	background-color: ${(props) => props.theme.bgColor};

}
ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}

	&:has(.dragging) ${TrashWrapper} {
		transition: 0.3s all ease-in-out;
		top: 0px;
	}
	&:has(.dragging-over-trash) ${TrashWrapper} {
		top: 0px;
		transition: 0.3s ease-in-out;
		transform: translate(-50%, 0%) scale(1.2);
	}

`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px 30px;
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
  font-size: 28px;
  cursor: pointer;
  z-index: 1;
  &:hover {
    transition: 0.5s all ease-in-out;
    color: #3498db;
  }
`;

const KanBanTitle = styled.h1`
  color: ${(props) => props.theme.cardTextColor};
  font-size: 32px;
  font-weight: bold;
`;

const KanBanBlock = styled.div`
  padding: 20px 0px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
`;

const KanBanDarkModeIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const KanBanIcon = styled.div`
  font-size: 28px;
  cursor: pointer;
  z-index: 1;
  &:hover {
    transition: 0.5s all ease-in-out;
    color: #3498db;
  }
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
  const [darkMode, setDarkMode] = useRecoilState(darkModeState);

  const handleAddBoard = () => {
    const boardName = window.prompt("보드이름을 입력하세요.");

    const boardCopy = Object.keys(todos)
      .map((boardId) => boardId)
      .filter((boardId) => boardName === boardId);

    if (boardCopy.length >= 1) {
      window.alert("중복된 보드가 있습니다.");
      return;
    }

    if (boardName === null) {
      window.alert("빈칸을 확인해주세요.");
      return;
    }

    setTodos((allBoards) => {
      return {
        ...allBoards,
        [String(boardName)]: [],
      };
    });
  };

  const onDragEnd = (info: DropResult) => {
    const { destination, source, draggableId } = info;
    if (!destination) return;

    // if (source.droppableId === "boards") {
    //   setBoards((prev) => {
    //     const boardCopy = [...prev];
    //     const item = boardCopy.splice(source.index, 1)[0];
    //     console.log(item);
    //     boardCopy.splice(destination.index, 0, item);
    //     return boardCopy;
    //   });
    // }
    if (destination?.droppableId === "trashCan") {
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
    <>
      <ThemeProvider theme={darkMode ? lightTheme : darkTheme}>
        <GlobalStyled />
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

            <KanBanBlock>
              <KanBanTitle>KanBoard</KanBanTitle>
              {/* dark */}
              <KanBanDarkModeIcon>
                <KanBanIcon
                  onClick={() => {
                    return setDarkMode(!darkMode);
                  }}
                >
                  {darkMode ? (
                    <MdOutlineWbSunny></MdOutlineWbSunny>
                  ) : (
                    <MdDarkMode></MdDarkMode>
                  )}
                </KanBanIcon>

                <AddBoard>
                  <AiFillFolderAdd onClick={handleAddBoard}></AiFillFolderAdd>
                </AddBoard>
              </KanBanDarkModeIcon>
            </KanBanBlock>

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
      </ThemeProvider>
    </>
  );
};

export default App;
