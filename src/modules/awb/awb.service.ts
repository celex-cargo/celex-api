import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Awb, AwbDocument } from './schemas/awb.schema';
import { Booking, BookingDocument } from '../bookings/schemas/booking.schema';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AwbService {
  constructor(
    @InjectModel(Awb.name) private model: Model<AwbDocument>,
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
  ) {}

  private generateNumber() {
    const prefix = (process.env.AWB_PREFIX || '888').padStart(3, '0');
    const serial = Math.floor(1000000 + Math.random() * 9000000); // 7-digit
    const checkDigit = serial % 7;
    const number = `${prefix}${serial}${checkDigit}`; // 11-digit
    return { number, checkDigit };
  }

  async createForBooking(bookingId: string) {
    const booking = await this.bookingModel.findById(bookingId).lean();
    if (!booking) throw new NotFoundException('Booking not found');

    const { number, checkDigit } = this.generateNumber();

    // Minimal PDF
    const pdf = await PDFDocument.create();
    const page = pdf.addPage([595, 842]);
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const draw = (txt: string, x: number, y: number, size = 12) =>
      page.drawText(txt, { x, y, size, font });

    draw('e-AWB (Celex Cargo)', 50, 800, 18);
    draw(`AWB: ${number}`, 50, 770, 14);
    draw(`Booking: ${bookingId}`, 50, 750);
    draw(`Shipper: ${booking.shipper?.name || '-'}`, 50, 730);
    draw(`Consignee: ${booking.consignee?.name || '-'}`, 50, 710);

    const pdfBytes = await pdf.save();
    const root = process.cwd();
    const dir = process.env.STORAGE_DIR || './storage';
    const awbDir = path.resolve(root, dir, 'awb');
    if (!fs.existsSync(awbDir)) fs.mkdirSync(awbDir, { recursive: true });
    const pdfPath = path.resolve(awbDir, `${number}.pdf`);
    fs.writeFileSync(pdfPath, pdfBytes);

    const doc = new this.model({ bookingId, number, checkDigit, pdfPath });
    return doc.save();
  }

  findByNumber(awbNo: string) {
    return this.model.findOne({ number: awbNo }).lean();
  }
}
