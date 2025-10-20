import { ArrowLeft, CheckCircle, Users2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export function TeacherApplicationPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    education: '',
    qualifications: '',
    experience: '',
    teachingExperience: '',
    specializations: [] as string[],
    preferredSchedule: '',
    onlineTeaching: false,
    offlineTeaching: false,
    motivation: '',
    references: [{ name: '', relationship: '', contact: '' }],
    agreedToBackgroundCheck: false,
    agreedToTerms: false,
  });

  const specializationOptions = [
    'Алгебра',
    'Геометрия',
    'Математический анализ',
    'Теория вероятностей',
    'Статистика',
    'Дискретная математика',
    'Подготовка к ЕГЭ',
    'Подготовка к ОГЭ',
    'Высшая математика',
    'Линейная алгебра',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSpecializationChange = (specialization: string) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.includes(specialization)
        ? prev.specializations.filter(s => s !== specialization)
        : [...prev.specializations, specialization],
    }));
  };

  const handleReferenceChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      references: prev.references.map((ref, i) =>
        i === index ? { ...ref, [field]: value } : ref
      ),
    }));
  };

  const addReference = () => {
    setFormData(prev => ({
      ...prev,
      references: [...prev.references, { name: '', relationship: '', contact: '' }],
    }));
  };

  const removeReference = (index: number) => {
    setFormData(prev => ({
      ...prev,
      references: prev.references.filter((_, i) => i !== index),
    }));
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
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
      setTrackingCode('TEA' + Math.random().toString(36).substr(2, 6).toUpperCase());
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
              Ваша заявка на преподавание принята к рассмотрению. 
              Процесс рассмотрения может занять до 7 рабочих дней.
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
            <Users2 className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Заявка на преподавание
          </h1>
          <p className="text-gray-600">
            Присоединяйтесь к команде лучших преподавателей математики
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((stepNumber) => (
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
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-soft p-8">
          <form onSubmit={handleSubmit}>
            {/* Шаг 1: Личная информация */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Личная информация
                  </h2>
                  <p className="text-gray-600">
                    Расскажите нам о себе
                  </p>
                </div>

                <div>
                  <label className="label">
                    Полное имя *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    className="input"
                    placeholder="Анна Петровна Иванова"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">
                      Email адрес *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="input"
                      placeholder="teacher@email.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="label">
                      Телефон *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      className="input"
                      placeholder="+7 (999) 123-45-67"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="label">
                    Дата рождения *
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    required
                    className="input"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            {/* Шаг 2: Образование и квалификация */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Образование и квалификация
                  </h2>
                  <p className="text-gray-600">
                    Расскажите о своем образовании и профессиональных навыках
                  </p>
                </div>

                <div>
                  <label className="label">
                    Высшее образование *
                  </label>
                  <textarea
                    name="education"
                    required
                    rows={3}
                    className="input"
                    placeholder="Укажите учебное заведение, факультет, специальность, год окончания..."
                    value={formData.education}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="label">
                    Дополнительные квалификации и сертификаты
                  </label>
                  <textarea
                    name="qualifications"
                    rows={3}
                    className="input"
                    placeholder="Курсы повышения квалификации, сертификаты, научные степени..."
                    value={formData.qualifications}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="label">
                    Общий опыт работы *
                  </label>
                  <textarea
                    name="experience"
                    required
                    rows={3}
                    className="input"
                    placeholder="Опишите ваш профессиональный опыт..."
                    value={formData.experience}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="label">
                    Опыт преподавания *
                  </label>
                  <textarea
                    name="teachingExperience"
                    required
                    rows={3}
                    className="input"
                    placeholder="Опишите ваш опыт преподавания математики (количество лет, возрастные группы, достижения)..."
                    value={formData.teachingExperience}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            {/* Шаг 3: Специализации и предпочтения */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Специализации и предпочтения
                  </h2>
                  <p className="text-gray-600">
                    Выберите направления и условия работы
                  </p>
                </div>

                <div>
                  <label className="label">
                    Специализации * (выберите все подходящие)
                  </label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {specializationOptions.map((spec) => (
                      <label key={spec} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.specializations.includes(spec)}
                          onChange={() => handleSpecializationChange(spec)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{spec}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="label">
                    Предпочитаемый формат работы *
                  </label>
                  <div className="space-y-2 mt-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="onlineTeaching"
                        checked={formData.onlineTeaching}
                        onChange={handleChange}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Онлайн консультации</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="offlineTeaching"
                        checked={formData.offlineTeaching}
                        onChange={handleChange}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Очные консультации</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="label">
                    Предпочитаемое расписание
                  </label>
                  <textarea
                    name="preferredSchedule"
                    rows={2}
                    className="input"
                    placeholder="Укажите удобные дни и время для проведения консультаций..."
                    value={formData.preferredSchedule}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="label">
                    Мотивация *
                  </label>
                  <textarea
                    name="motivation"
                    required
                    rows={4}
                    className="input"
                    placeholder="Почему вы хотите преподавать на нашей платформе? Каков ваш подход к обучению?"
                    value={formData.motivation}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            {/* Шаг 4: Рекомендации и согласия */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Рекомендации и согласия
                  </h2>
                  <p className="text-gray-600">
                    Последний шаг для завершения заявки
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="label mb-0">
                      Рекомендации (минимум 1) *
                    </label>
                    <button
                      type="button"
                      onClick={addReference}
                      className="btn-outline text-sm"
                    >
                      Добавить
                    </button>
                  </div>
                  
                  {formData.references.map((reference, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">
                          Рекомендация {index + 1}
                        </h4>
                        {formData.references.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeReference(index)}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            Удалить
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                          type="text"
                          placeholder="Имя"
                          className="input"
                          value={reference.name}
                          onChange={(e) => handleReferenceChange(index, 'name', e.target.value)}
                          required
                        />
                        <input
                          type="text"
                          placeholder="Должность/отношение"
                          className="input"
                          value={reference.relationship}
                          onChange={(e) => handleReferenceChange(index, 'relationship', e.target.value)}
                          required
                        />
                        <input
                          type="text"
                          placeholder="Контакт (email/телефон)"
                          className="input"
                          value={reference.contact}
                          onChange={(e) => handleReferenceChange(index, 'contact', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
                  <h3 className="font-medium text-warning-900 mb-2">
                    Процесс рассмотрения заявки
                  </h3>
                  <ul className="text-sm text-warning-700 space-y-1">
                    <li>• Проверка документов и рекомендаций (2-3 дня)</li>
                    <li>• Проведение интервью (видеозвонок)</li>
                    <li>• Проверка квалификации (тестовое задание)</li>
                    <li>• Окончательное решение и уведомление</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="agreedToBackgroundCheck"
                      name="agreedToBackgroundCheck"
                      required
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                      checked={formData.agreedToBackgroundCheck}
                      onChange={handleChange}
                    />
                    <label htmlFor="agreedToBackgroundCheck" className="ml-3 text-sm text-gray-700">
                      Я соглашаюсь на проведение проверки квалификации и предоставление необходимых документов *
                    </label>
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
                        Условиями сотрудничества
                      </a>{' '}
                      и{' '}
                      <a href="#" className="text-primary-600 hover:text-primary-500">
                        Политикой конфиденциальности
                      </a>
                      , а также даю согласие на обработку персональных данных *
                    </label>
                  </div>
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

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-primary"
                  disabled={
                    (step === 1 && (!formData.fullName || !formData.email || !formData.phone || !formData.dateOfBirth)) ||
                    (step === 2 && (!formData.education || !formData.experience || !formData.teachingExperience)) ||
                    (step === 3 && (formData.specializations.length === 0 || (!formData.onlineTeaching && !formData.offlineTeaching) || !formData.motivation))
                  }
                >
                  Далее
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.agreedToBackgroundCheck || !formData.agreedToTerms}
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
