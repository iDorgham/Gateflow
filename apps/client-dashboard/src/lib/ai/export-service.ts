import { prisma } from '@gate-access/db';
import { Parser } from 'json2csv';
import PDFDocument from 'pdfkit';
import { sendEmail } from '@/lib/email';

/**
 * GateAI Operations Hub - Export Service
 * Logic for generating CSV/PDF reports and delivering them.
 */

export async function generateAndDeliverReport(automationId: string) {
  const automation = await prisma.aiAutomation.findUnique({
    where: { id: automationId },
    include: { organization: true }
  });

  if (!automation || automation.deletedAt) return;

  const action = automation.action as { reportType: string; format: string; recipients?: string[] };
  const { reportType, format, recipients } = action;
  const orgId = automation.organizationId;

  try {
    // 1. Fetch Data based on reportType
    let data: unknown[] = [];
    if (reportType === 'VISITORS') {
      data = await prisma.contact.findMany({
        where: { organizationId: orgId, deletedAt: null },
        take: 100,
        orderBy: { createdAt: 'desc' },
        select: { firstName: true, lastName: true, phone: true, email: true, createdAt: true }
      });
    } else {
      data = await prisma.scanLog.findMany({
        where: { gate: { organizationId: orgId } },
        take: 100,
        orderBy: { scannedAt: 'desc' },
        select: { status: true, scannedAt: true }
      });
    }

    // 2. Format Data
    let buffer: Buffer;
    let contentType: string;
    const fileName = `${automation.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.${format.toLowerCase()}`;

    if (format === 'CSV') {
      const parser = new Parser();
      const csv = parser.parse(data);
      buffer = Buffer.from(csv);
      contentType = 'text/csv';
    } else {
      // PDF Generation
      buffer = await new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const chunks: Buffer[] = [];
        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        doc.fontSize(20).text(`Operational Report: ${automation.name}`, { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Organization: ${automation.organization.name}`);
        doc.text(`Date: ${new Date().toLocaleString()}`);
        doc.moveDown();

        data.forEach((item, index) => {
          doc.text(`${index + 1}. ${JSON.stringify(item)}`);
          doc.moveDown(0.5);
        });

        doc.end();
      });
      contentType = 'application/pdf';
    }

    // 3. Deliver (Email)
    if (recipients && recipients.length > 0) {
      await sendEmail({
        to: recipients.join(','),
        subject: `[GateAI Hub] Automated Report: ${automation.name}`,
        text: `Please find attached your automated ${reportType} report for ${automation.organization.name}.`,
        attachments: [
          {
            filename: fileName,
            content: buffer,
            contentType
          }
        ]
      });
    }

    // 4. Update automation record
    await prisma.aiAutomation.update({
      where: { id: automationId },
      data: {
        lastRunAt: new Date(),
        // nextRunAt would be calculated here based on the cron/frequency
      }
    });

    console.log(`[ExportService] Successfully delivered report for automation ${automationId}`);
  } catch (error: unknown) {
    console.error(`[ExportService] Failed to generate/deliver report for ${automationId}:`, error);
    throw error;
  }
}
