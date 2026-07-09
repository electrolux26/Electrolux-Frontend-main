import { InvoiceStatus, DocumentStatus, DebitCreditIndicator } from '../models/invoice.model';

// Programmatically generate 45 demo invoices with flat missingFields (fieldKey: "")
export const demoInvoices: any[] = Array.from({ length: 45 }).map((_, idx) => {
  const n = idx + 1;
  const id = `DEM-${String(n).padStart(3, '0')}`;
  const invoiceNumber = `INV-DEMO-${String(n).padStart(3, '0')}`;

  // choose some missing field keys to vary across rows
  const missingFieldCandidates = [
    'vendorData.name2',
    'vendorData.poBox',
    'invoiceData.transEvent',
    'invoiceData.startDate',
    'invoiceData.endDate',
    'invoiceData.responsiblePerson',
    'accountingHeaderData.exchangeRate',
    'paymentData.transEvent',
    'accountingAdditionalData.docHeaderText',
    `lineItems[0].profitCenter`,
    `lineItems[1].productGroup`,
    'taxData.vatDate',
    'processInformation.batchNumber',
    'processInformation.changedBy',
  ];

  // pick 2-4 missing fields per invoice deterministically
  const chosen = missingFieldCandidates.filter((_, i) => (n + i) % 3 === 0 || (n + i) % 5 === 0).slice(0, 4);

  const missingFieldsFlat: Record<string, string> = {};
  chosen.forEach((k) => (missingFieldsFlat[k] = ''));

  return {
    id,
    invoiceNumber,
    status: InvoiceStatus.PENDING,
    documentStatus: DocumentStatus.CREATED,
    vendorData: {
      vendorNumber: `V${String(n).padStart(3, '0')}`,
      vendorName: `Demo Vendor ${n}`,
      iban: `DE00DEMO${String(n).padStart(10, '0')}`,
      swiftCode: 'DEMOXXX',
      streetHouseNo: `${n} Demo Street`,
      postCodeCity: '00000 DemoCity',
      countryRegion: 'DE',
    },
    recipientData: {
      companyCode: 'DE01',
      recipientName: 'Electrolux Demo',
    },
    invoiceData: {
      referenceNumber: `REF-DEMO-${n}`,
      autoCalculateTax: true,
      grossAmount: 1000 + n * 10,
      taxAmount: 190 + n,
      documentDate: '2024-01-21',
      startDate: `2024-01-${String((n % 22) + 1).padStart(2, '0')}`,
      endDate: `2024-01-${String(((n + 5) % 22) + 1).padStart(2, '0')}`,
      responsiblePerson: ['John Williams', 'Sarah Mitchell', 'Robert Taylor', 'Emma Wilson'][n % 4],
      balance: 1000 + n * 10,
      taxCode: 'V1',
      taxRate: 19,
    },
    accountingHeaderData: {
      vendorNumber: `V${String(n).padStart(3, '0')}`,
      vendorName: `Demo Vendor ${n}`,
      documentType: 'KR',
      postingDate: '2024-01-23',
      companyCode: 'DE01',
      referenceNumber: `REF-DEMO-${n}`,
      documentDate: '2024-01-21',
      documentCurrency: 'EUR',
    },
    paymentData: {
      dueOn: '2024-02-20',
    },
    accountingAdditionalData: {},
    lineItems: [
      {
        id: `${id}-LI-1`,
        glAccount: '4000-000',
        shortText: 'Demo product A',
        debitCreditIndicator: DebitCreditIndicator.DEBIT,
        amount: 500 + n,
        taxCode: 'V1',
      },
      {
        id: `${id}-LI-2`,
        glAccount: '4100-000',
        shortText: 'Demo product B',
        debitCreditIndicator: DebitCreditIndicator.DEBIT,
        amount: 500 + n * 2,
        taxCode: 'V1',
      },
    ],
    taxData: {
      taxCode: 'V1',
      taxRate: 19,
      taxAmount: 190 + n,
      autoCalculateTax: true,
    },
    processDocumentData: {},
    processInformation: {},
    otherAdditionalData: {},
    // IMPORTANT: Flat missingFields mapping as expected from dataverse/api
    missingFields: missingFieldsFlat,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
});

export default demoInvoices;
