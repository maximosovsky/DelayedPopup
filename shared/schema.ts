import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Schema for popup configuration
export const popupConfigurations = pgTable("popup_configurations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // stored in cents
  priceDisplay: text("price_display").notNull(),
  discount: text("discount"),
  imageSrc: text("image_src").notNull(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertPopupConfigSchema = createInsertSchema(popupConfigurations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPopupConfig = z.infer<typeof insertPopupConfigSchema>;
export type PopupConfig = typeof popupConfigurations.$inferSelect;
