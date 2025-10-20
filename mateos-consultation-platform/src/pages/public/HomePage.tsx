import { Award, BookOpenCheck, Brain, Calculator, CheckCircle, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">M</span>
                </div>
                <span className="ml-2 text-2xl font-bold text-gray-900">Mateos</span>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/preturi" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Prețuri
                </Link>
                <Link to="/aplicare-profesor" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Devino Profesor
                </Link>
                <Link to="/login" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Autentificare
                </Link>
                <Link to="/inregistrare" className="btn-primary">
                  Începe acum
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Platform Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Platforma Mateos de Consultații Matematice
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Conectează studenții cu profesori experți pentru consultații personalizate de matematică. 
              Învățare eficientă prin abordare individuală și metode moderne de predare.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">500+</div>
              <div className="text-sm text-gray-600">Studenți activi</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">50+</div>
              <div className="text-sm text-gray-600">Profesori verificați</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">2000+</div>
              <div className="text-sm text-gray-600">Consultații realizate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">4.9</div>
              <div className="text-sm text-gray-600">Rating mediu</div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Funcționalitățile Platformei
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Matching Inteligent
              </h3>
              <p className="text-gray-600">
                Algoritmul nostru conectează studenții cu profesorii potriviți pe baza nivelului, specializării și preferințelor.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpenCheck className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Materiale Integrate
              </h3>
              <p className="text-gray-600">
                Bibliotecă vastă de exerciții, exemple rezolvate și materiale teoretice accesibile direct în platformă.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Calculator className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Whiteboard Virtual
              </h3>
              <p className="text-gray-600">
                Instrument colaborativ pentru rezolvarea problemelor în timp real, atât pentru consultațiile online cât și offline.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Progres Tracking
              </h3>
              <p className="text-gray-600">
                Monitorizarea progresului studentului cu rapoarte detaliate și feedback personalizat de la profesori.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Programare Flexibilă
              </h3>
              <p className="text-gray-600">
                Sistem avansat de programare care permite studenților să-și aleagă timpul optim pentru consultații.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Sistem de Evaluare
              </h3>
              <p className="text-gray-600">
                Rating și review-uri pentru profesori, asigurând transparența și calitatea serviciilor oferite.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Access */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Accesează Platforma
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Înregistrează-te pentru a începe călătoria ta în învățarea matematicii
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/inregistrare-student" className="btn-primary text-lg px-8 py-3">
              Cont Student
            </Link>
            <Link to="/aplicare-profesor" className="btn-outline text-lg px-8 py-3">
              Aplică ca Profesor
            </Link>
            <Link to="/preturi" className="btn-outline text-lg px-8 py-3">
              Vezi Prețurile
            </Link>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="ml-2 text-xl font-bold">Mateos</span>
            </div>
            
            <div className="flex space-x-6 text-sm">
              <Link to="/preturi" className="hover:text-primary-400">Prețuri</Link>
              <Link to="/aplicare-profesor" className="hover:text-primary-400">Profesori</Link>
              <a href="#" className="hover:text-primary-400">Contact</a>
              <a href="#" className="hover:text-primary-400">Suport</a>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-6 pt-6 text-center text-sm text-gray-400">
            <p>&copy; 2025 Mateos. Platforma de consultații matematice. Toate drepturile rezervate.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
