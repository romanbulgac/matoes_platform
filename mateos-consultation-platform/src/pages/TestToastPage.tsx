import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAlert } from '@/hooks/use-alert';
import { useErrorHandler } from '@/hooks/use-error-handler';

/**
 * Тестовая страница для проверки новой Toast системы
 * Временная страница для разработки
 */
export function TestToastPage() {
  const alert = useAlert();
  const errorHandler = useErrorHandler();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🧪 Toast System Test Page</CardTitle>
            <CardDescription>
              Тестирование новой системы уведомлений на базе shadcn/ui Toast
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Базовые методы useAlert */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Базовые уведомления (useAlert)</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => alert.showSuccess('Операция выполнена успешно!', 'Успех')}
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
                >
                  ✅ Success Toast
                </Button>
                
                <Button
                  onClick={() => alert.showError('Произошла ошибка!', 'Ошибка')}
                  variant="destructive"
                >
                  ❌ Error Toast
                </Button>
                
                <Button
                  onClick={() => alert.showWarning('Проверьте введенные данные', 'Внимание')}
                  variant="outline"
                  className="border-yellow-500 text-yellow-700 hover:bg-yellow-50"
                >
                  ⚠️ Warning Toast
                </Button>
                
                <Button
                  onClick={() => alert.showInfo('Новое обновление доступно', 'Информация')}
                  variant="outline"
                  className="border-blue-500 text-blue-700 hover:bg-blue-50"
                >
                  ℹ️ Info Toast
                </Button>
              </div>
            </div>

            {/* Методы errorHandler */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Error Handler уведомления</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => errorHandler.showSuccess('Данные сохранены!', 'Успех')}
                  variant="default"
                >
                  ✅ Handler Success
                </Button>
                
                <Button
                  onClick={() => errorHandler.showError('Ошибка сохранения', 'Ошибка')}
                  variant="destructive"
                >
                  ❌ Handler Error
                </Button>
                
                <Button
                  onClick={() => errorHandler.showWarning('Данные устарели', 'Предупреждение')}
                  variant="outline"
                >
                  ⚠️ Handler Warning
                </Button>
                
                <Button
                  onClick={() => errorHandler.showInfo('Процесс начался', 'Информация')}
                  variant="outline"
                >
                  ℹ️ Handler Info
                </Button>
              </div>
            </div>

            {/* Симуляция реальных ошибок */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Симуляция реальных ошибок</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => {
                    const error = new Error('Network timeout');
                    (error as any).status = 408;
                    errorHandler.handleError(error);
                  }}
                  variant="outline"
                >
                  🌐 Network Error
                </Button>
                
                <Button
                  onClick={() => {
                    const error = new Error('Unauthorized');
                    (error as any).status = 401;
                    errorHandler.handleAuthError(error);
                  }}
                  variant="outline"
                >
                  🔒 Auth Error
                </Button>
                
                <Button
                  onClick={() => {
                    const error = new Error('Validation failed');
                    (error as any).status = 422;
                    errorHandler.handleValidationError(error);
                  }}
                  variant="outline"
                >
                  📋 Validation Error
                </Button>
                
                <Button
                  onClick={() => {
                    const error = new Error('Server error');
                    (error as any).status = 500;
                    errorHandler.handleError(error);
                  }}
                  variant="outline"
                >
                  🔥 Server Error
                </Button>
              </div>
            </div>

            {/* Тест с кастомной длительностью */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Кастомная длительность</h3>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  onClick={() => alert.showSuccess('Быстрое (1 сек)', 'Тест', 1000)}
                  variant="outline"
                  size="sm"
                >
                  ⚡ 1 секунда
                </Button>
                
                <Button
                  onClick={() => alert.showInfo('Стандартное (5 сек)', 'Тест', 5000)}
                  variant="outline"
                  size="sm"
                >
                  ⏱️ 5 секунд
                </Button>
                
                <Button
                  onClick={() => alert.showWarning('Долгое (10 сек)', 'Тест', 10000)}
                  variant="outline"
                  size="sm"
                >
                  ⏳ 10 секунд
                </Button>
              </div>
            </div>

            {/* Массовый тест */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Стресс-тест</h3>
              <Button
                onClick={() => {
                  alert.showInfo('Начинаем обработку...', 'Шаг 1');
                  setTimeout(() => alert.showInfo('Загрузка данных...', 'Шаг 2'), 500);
                  setTimeout(() => alert.showWarning('Найдены предупреждения', 'Шаг 3'), 1000);
                  setTimeout(() => alert.showSuccess('Обработка завершена!', 'Шаг 4'), 1500);
                }}
                variant="outline"
                className="w-full"
              >
                🚀 Показать 4 Toast подряд
              </Button>
            </div>

            {/* Прямое использование toast */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Продвинутое использование</h3>
              <Button
                onClick={() => {
                  alert.toast({
                    title: "Пользовательский Toast",
                    description: "Это кастомный toast с длинным текстом и дополнительными возможностями. Вы можете добавить любые элементы.",
                    duration: 0, // Бесконечный
                  });
                }}
                variant="outline"
                className="w-full"
              >
                🎨 Кастомный Toast (бесконечный)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Информация */}
        <Card>
          <CardHeader>
            <CardTitle>📋 Информация о системе</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Библиотека:</span>
              <span className="font-semibold">shadcn/ui Toast (Radix UI)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Hook:</span>
              <span className="font-semibold">useAlert() / useErrorHandler()</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Позиция:</span>
              <span className="font-semibold">Top-right (настраиваемо)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Анимация:</span>
              <span className="font-semibold">CSS Transitions (нативные)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Статус:</span>
              <span className="font-semibold text-green-600">✅ Активна</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
