import { GroupsOverview, IndividualStudents } from '@/components/teacher';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, Users } from 'lucide-react';

/**
 * StudentsPage - Pagină dedicată pentru gestionarea studenților
 * 
 * Funcționalități:
 * - Tab "Grupe" - afișează toate grupurile profesorului
 * - Tab "Studenți Individuali" - afișează studenții care nu sunt în grupuri
 * - Gestionare membri și grupuri
 */
export const StudentsPage: React.FC = () => {
  return (
    <div className="container mx-auto p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Studenții mei</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Gestionează grupe și studenți individuali
          </p>
        </div>
      </div>

      {/* Tabs for Groups and Individual Students */}
      <Tabs defaultValue="groups" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="groups" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Grupe</span>
          </TabsTrigger>
          <TabsTrigger value="individual" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            <span>Studenți Individuali</span>
          </TabsTrigger>
        </TabsList>

        {/* Groups Tab */}
        <TabsContent value="groups">
          <GroupsOverview />
        </TabsContent>

        {/* Individual Students Tab */}
        <TabsContent value="individual">
          <IndividualStudents />
        </TabsContent>
      </Tabs>
    </div>
  );
};
