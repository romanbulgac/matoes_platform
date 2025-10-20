import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, GraduationCap } from 'lucide-react';

export function StudentRegistrationPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');
  const [formData, setFormData] = useState({
    studentFullname: '',
    studentAge: '',
    parentFirstname: '',
    parentLastname: '',
    parentEmail: '',
    parentPhone: '',
    mathLevel: '',
    learningGoals: '',
    specialNeedsDescription: '',
    preferredSchedule: '',
    agreedToTerms: false,
  });

  const mathLevels = [
    { value: 'elementary', label: 'Начальная школа (1-4 класс)' },
    { value: 'middle', label: 'Средняя школа (5-9 класс)' },
    { value: 'high', label: 'Старшая школа (10-11 класс)' },
    { value: 'university', label: 'Университет/институт' },
    { value: 'preparation', label: 'Подготовка к экзаменам (ЕГЭ, ОГЭ)' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Симуляция отправки заявки
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTrackingCode('STU' + Math.random().toString(36).substr(2, 6).toUpperCase());
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-success-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-xl shadow-soft p-8">
            <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-success-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Заявка успешно отправлена!
            </h1>
            
            <p className="text-gray-600 mb-6">
              Ваша заявка на регистрацию студента принята к рассмотрению. 
              Мы свяжемся с вами в течение 2-3 рабочих дней.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-2">Код отслеживания заявки:</p>
              <p className="text-lg font-mono font-bold text-primary-600">
                {trackingCode}
              </p>
            </div>

            <div className="space-y-3">
              <Link to="/" className="w-full btn-primary">
                Вернуться на главную
              </Link>
              <Link to="/login" className="w-full btn-outline">
                Войти в систему
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Вернуться на главную
          </Link>
          
          <div className="w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-6">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Регистрация студента
          </h1>
          <p className="text-gray-600">
            Заполните форму для записи на математические консультации
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  step >= stepNumber
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {stepNumber}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-soft p-8">
          <form onSubmit={handleSubmit}>
            {/* Шаг 1: Информация о студенте */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Информация о студенте
                  </h2>
                  <p className="text-gray-600">
                    Расскажите нам о студенте и его уровне подготовки
                  </p>
                </div>

                <div>
                  <label className="label">
                    Полное имя студента *
                  </label>
                  <input
                    type="text"
                    name="studentFullName"
                    required
                    className="input"
                    placeholder="Иван Иванов"
                    value={formData.studentFullname}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="label">
                    Возраст студента *
                  </label>
                  <input
                    type="number"
                    name="studentAge"
                    required
                    min="5"
                    max="25"
                    className="input"
                    placeholder="15"
                    value={formData.studentAge}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="label">
                    Уровень математической подготовки *
                  </label>
                  <select
                    name="mathLevel"
                    required
                    className="input"
                    value={formData.mathLevel}
                    onChange={handleChange}
                  >
                    <option value="">Выберите уровень</option>
                    {mathLevels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">
                    Цели обучения
                  </label>
                  <textarea
                    name="learningGoals"
                    rows={3}
                    className="input"
                    placeholder="Например: подготовка к ЕГЭ, улучшение оценок, понимание сложных тем..."
                    value={formData.learningGoals}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            {/* Шаг 2: Информация о родителе/опекуне */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Контактная информация
                  </h2>
                  <p className="text-gray-600">
                    Данные родителя или опекуна для связи
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">
                      Имя родителя/опекуна *
                    </label>
                    <input
                      type="text"
                      name="parentFirstName"
                      required
                      className="input"
                      placeholder="Анна"
                      value={formData.parentFirstname}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="label">
                      Фамилия *
                    </label>
                    <input
                      type="text"
                      name="parentLastName"
                      required
                      className="input"
                      placeholder="Иванова"
                      value={formData.parentLastname}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="label">
                    Email адрес *
                  </label>
                  <input
                    type="email"
                    name="parentEmail"
                    required
                    className="input"
                    placeholder="parent@email.com"
                    value={formData.parentEmail}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="label">
                    Телефон *
                  </label>
                  <input
                    type="tel"
                    name="parentPhone"
                    required
                    className="input"
                    placeholder="+7 (999) 123-45-67"
                    value={formData.parentPhone}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="label">
                    Предпочитаемое время для консультаций
                  </label>
                  <textarea
                    name="preferredSchedule"
                    rows={2}
                    className="input"
                    placeholder="Например: будние дни после 16:00, выходные утром..."
                    value={formData.preferredSchedule}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            {/* Шаг 3: Дополнительная информация */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Дополнительная информация
                  </h2>
                  <p className="text-gray-600">
                    Последние детали для персонализации обучения
                  </p>
                </div>

                <div>
                  <label className="label">
                    Особые потребности или ограничения
                  </label>
                  <textarea
                    name="specialNeedsDescription"
                    rows={3}
                    className="input"
                    placeholder="Укажите любые особенности, которые следует учесть при обучении..."
                    value={formData.specialNeedsDescription}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Эта информация поможет нам подобрать наиболее подходящего преподавателя
                  </p>
                </div>

                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                  <h3 className="font-medium text-primary-900 mb-2">
                    Что происходит дальше?
                  </h3>
                  <ul className="text-sm text-primary-700 space-y-1">
                    <li>• Мы рассмотрим вашу заявку в течение 2-3 рабочих дней</li>
                    <li>• Свяжемся с вами для уточнения деталей</li>
                    <li>• Подберем подходящего преподавателя</li>
                    <li>• Предложим удобное расписание консультаций</li>
                  </ul>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="agreedToTerms"
                    name="agreedToTerms"
                    required
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                    checked={formData.agreedToTerms}
                    onChange={handleChange}
                  />
                  <label htmlFor="agreedToTerms" className="ml-3 text-sm text-gray-700">
                    Я соглашаюсь с{' '}
                    <a href="#" className="text-primary-600 hover:text-primary-500">
                      Условиями использования
                    </a>{' '}
                    и{' '}
                    <a href="#" className="text-primary-600 hover:text-primary-500">
                      Политикой конфиденциальности
                    </a>
                    , а также даю согласие на обработку персональных данных
                  </label>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="btn-outline"
                >
                  Назад
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-primary"
                >
                  Далее
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.agreedToTerms}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Отправка...
                    </div>
                  ) : (
                    'Отправить заявку'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
