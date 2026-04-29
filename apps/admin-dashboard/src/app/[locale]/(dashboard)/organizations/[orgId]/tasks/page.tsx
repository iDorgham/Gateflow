import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@gate-access/db';
import { TaskManagerClient } from '@/components/tasks/TaskManagerClient';
import { Department } from '@prisma/client';

export default async function TasksPage({
  params,
}: {
  params: { locale: string; orgId: string };
}) {
  await requireAdmin(params.locale as any);

  const boards = await prisma.taskBoard.findMany({
    where: { organizationId: params.orgId },
    include: {
      tasks: {
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  // If no boards exist, create a default one for each department
  if (boards.length === 0) {
    const departments: Department[] = ['SALES', 'MARKETING', 'DEV', 'SUPPORT'];
    await prisma.$transaction(
      departments.map((dept) =>
        prisma.taskBoard.create({
          data: {
            name: `${dept.charAt(0) + dept.slice(1).toLowerCase()} Board`,
            department: dept,
            organizationId: params.orgId,
          },
        })
      )
    );
    // Refresh boards
    const newBoards = await prisma.taskBoard.findMany({
      where: { organizationId: params.orgId },
      include: {
        tasks: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    return <TaskManagerClient initialBoards={newBoards} orgId={params.orgId} />;
  }

  return <TaskManagerClient initialBoards={boards} orgId={params.orgId} />;
}
