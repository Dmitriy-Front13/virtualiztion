import { useState, useEffect, useRef, memo } from 'react';
import ListItem from './ListItem';

const App = () => {
  const [users, setUsers] = useState([]); // Массив пользователей
  const [isLoading, setIsLoading] = useState(false); // Индикатор загрузки
  const triggerRef = useRef(null);
  const observer = useRef(
    new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          fetchUsers();
        }
      },
      { threshold: 1.0 } // Настраиваем, чтобы срабатывать, когда элемент полностью видим
    ));

  // Функция для загрузки пользователей с API
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://randomuser.me/api/?results=10&page=1`);
      const data = await response.json();
      setUsers((prevUsers) => [...prevUsers, ...data.results]); // Добавляем новых пользователей в массив
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (triggerRef.current) {
      observer.current.disconnect();
      observer.current.observe(triggerRef.current); // Начинаем отслеживать последний элемент
    }
  }, [users]); // Запускаем эффект каждый раз, когда меняется список пользователей

  return (
    <div className="App" style={{ padding: '20px' }}>
      <h1>Бесконечная прокрутка - Пользователи</h1>
      <div className="user-list">
        {users.map((user, index) => (
          <ListItem
            user={user}
            key={index}
            ref={index === users.length - 1 ? triggerRef : null} // Привязываем ref к последнему элементу
          />
        ))}
      </div>
      {isLoading && <p>Загрузка...</p>}
    </div>
  );
};

export default App;
