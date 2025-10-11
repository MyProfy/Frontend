import styled from "@emotion/styled";

// Контейнер для всего баннера
export const BannerContainer = styled.div`
    margin-top: 120px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    width: 100%;
    box-sizing: border-box;
    @media (max-width: 768px) {
        padding: 10px;
    }
`;

// Заголовок
export const MainTitle = styled.h1`
    font-size: 2rem;
    font-weight: 300;
    color: #000;
    margin-bottom: 33px;
    margin-left: 33px;
    @media (max-width: 768px) {
        font-size: 1.5rem;
        margin-left: 10px;
    }
`;

// Контейнер для поиска
export const SearchContainer = styled.div`
    display: flex;
    gap: 5px;
    margin-bottom: 40px;
    justify-content: center;
    width: 100%;
    @media (max-width: 768px) {
        flex-direction: column;
        align-items: center;
    }
`;

// Поле ввода для поиска
export const SearchInput = styled.input`
    padding: 18px;
    width: 905px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
    @media (max-width: 768px) {
        width: 100%;
        max-width: 100%;
    }
`;

// Кнопка "Найти"
export const StartButton = styled.button`
    padding: 10px 20px;
    background-color: #ccddb3;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    color: #000;
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;
    &:hover {
        background-color: #a0ffa0;
    }
    @media (max-width: 768px) {
        width: 100%;
        max-width: 200px;
    }
`;

// Контейнер для карусели
export const CarouselContainer = styled.div`
    background: rgba(200, 255, 200, 0.5);
    border-radius: 16px;
    padding: 40px 20px;
    width: 100%;
    max-width: 1300px;
    margin-top: -5px;
    margin-bottom: 20px;
    margin-left: auto;
    margin-right: auto;
    overflow: hidden;
    position: relative;
    height: 250px;
    @media (max-width: 768px) {
        padding: 20px 10px;
        height: 200px;
        max-width: 100%;
    }
`;

// Контейнер для слайдов
export const SlideWrapper = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
`;

// Текст слайда
export const CarouselText = styled.h2<{ isActive: boolean }>`
    font-size: 2rem;
    font-weight: 300;
    color: #000;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 100%;
    text-align: center;
    opacity: ${({ isActive }) => (isActive ? 1 : 0)};
    transition: opacity 0.5s ease-in-out;
    @media (max-width: 768px) {
        font-size: 1.5rem;
    }
`;

// Контейнер для формы запроса
export const RequestContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #ccddb3;
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 10px;
    margin-top: 1%;
    width: 30%;
    max-width: 800px;
    min-width: 300px;
    margin-left: auto;
    margin-right: auto;
    height: 300px;
    box-sizing: border-box;
    @media (max-width: 768px) {
        padding: 15px;
        height: 300px;
        width: 90%;
        margin-top: 5%;
    }
    @media (max-width: 480px) {
        width: 100%;
        margin-top: 3%;
    }
`;

// Текст формы запроса
export const RequestText = styled.div`
    display: flex;
    margin-top: -40px;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    text-align: center;
    width: 100%;
`;

// Заголовок формы
export const RequestTitle = styled.h3`
    font-size: 1.6rem;
    font-weight: 300;
    color: #000;
    margin: 0;
    @media (max-width: 768px) {
        font-size: 1.2rem;
    }
`;

// Описание формы
export const RequestDescription = styled.p`
    font-size: 1.0rem;
    color: #000;
    margin: 0;
    max-width: 100%;
    overflow-wrap: break-word;
    @media (max-width: 768px) {
        font-size: 1rem;
    }
`;

// Контейнер для поля ввода, счётчика и кнопки
export const RequestInputWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0px;
    width: 100%;
    max-width: 500px;
    max-height: 150px;
    @media (max-width: 768px) {
        max-width: 100%;
    }
`;

// Поле ввода для формы
export const RequestInput = styled.textarea`
    padding: 15px;
    width: 100%;
    height: 200px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1.1rem;
    resize: none;
    box-sizing: border-box;
    overflow-y: auto;
    @media (max-width: 768px) {
        padding: 12px;
        height: 150px;
        font-size: 1rem;
    }
`;

// Счётчик символов
export const CharacterCounter = styled.span`
    font-size: 0.8rem;
    color: #666;
    align-self: flex-end;
`;

// Кнопка отправки запроса
export const RequestButton = styled.button`
    padding: 10px 20px;
    margin-bottom: -35px;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 10px;
    font-size: 0.9rem;
    color: #000;
    cursor: pointer;
    margin-top: 10px;
    align-self: flex-end;
    transition: background-color 0.3s ease-in-out;
    &:hover {
        background-color: #f0f0f0;
    }
    @media (max-width: 600px) {
        width: 80%;
        max-width: 120px;
    }
`;

// Контейнер для списка специалистов
export const SpecialistsContainer = styled.div`
    width: 100%;
    max-width: 1500px;
    margin: 0 auto;
    margin-top: 60px;
    @media (max-width: 768px) {
        margin-top: 48px;
        padding: 0 12px;
    }
`;

// Заголовок списка специалистов
export const SpecialistsTitle = styled.h2`
    font-size: 2.4rem;
    font-weight: 300;
    color: #000;
    margin-bottom: 18px;
    text-align: center;
    @media (max-width: 768px) {
        font-size: 1.44rem;
    }
`;

// Описание списка специалистов
export const SpecialistsDescription = styled.p`
    font-size: 1.38rem;
    color: #666;
    margin-bottom: 36px;
    text-align: center;
    @media (max-width: 768px) {
        font-size: 1.08rem;
    }
`;

// Сетка для списка специалистов
export const SpecialistsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 72px;
    justify-content: center;
    @media (max-width: 868px) {
        grid-template-columns: repeat(2, 1fr);
    }
    @media (max-width: 480px) {
        grid-template-columns: 1fr;
    }
`;

// Элемент списка специалистов
export const SpecialistItem = styled.div`
    display: flex;
    flex-direction: column;
    gap: 9.6px;
`;

// Название категории специалистов
export const SpecialistCategory = styled.h3`
    font-size: 1.56rem;
    font-weight: bold;
    color: #000;
    @media (max-width: 768px) {
        font-size: 1.2rem;
    }
`;

// Количество специалистов в категории
export const SpecialistCount = styled.p`
    font-size: 1.44rem;
    color: #666;
    @media (max-width: 768px) {
        font-size: 0.96rem;
    }
`;

// Список подкатегорий
export const SubCategoryList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`;

// Элемент подкатегории
export const SubCategoryItem = styled.li`
    font-size: 1.38rem;
    color: #000;
    margin-bottom: 9.6px;
    @media (max-width: 768px) {
        font-size: 0.96rem;
    }
`;