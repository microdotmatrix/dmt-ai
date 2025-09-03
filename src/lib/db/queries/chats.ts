import "server-only";

import { db } from "@/lib/db";
import {
  ChatTable,
  MessageTable,
  StreamTable,
  VoteTable,
} from "@/lib/db/schema";
import {
  and,
  asc,
  count,
  desc,
  eq,
  gt,
  gte,
  inArray,
  lt,
  type SQL,
} from "drizzle-orm";

export const saveChat = async ({
  id,
  userId,
  entryId,
  documentId,
  documentCreatedAt,
  title,
  visibility,
}: {
  id: string;
  userId: string | null;
  entryId: string;
  documentId?: string;
  documentCreatedAt?: Date;
  title: string;
  visibility: "private" | "public";
}) => {
  try {
    return await db.insert(ChatTable).values({
      id,
      createdAt: new Date(),
      userId: userId!,
      entryId,
      documentId,
      documentCreatedAt,
      title,
      visibility,
    });
  } catch (error) {
    throw new Error("Failed to save chat");
  }
};

export const deleteChatById = async ({ id }: { id: string }) => {
  try {
    await db.delete(VoteTable).where(eq(VoteTable.chatId, id));
    await db.delete(MessageTable).where(eq(MessageTable.chatId, id));
    await db.delete(StreamTable).where(eq(StreamTable.chatId, id));

    const [chatsDeleted] = await db
      .delete(ChatTable)
      .where(eq(ChatTable.id, id))
      .returning();
    return chatsDeleted;
  } catch (error) {
    throw new Error("Failed to delete chat by id");
  }
};

export const getChatsByUserId = async ({
  id,
  limit,
  startingAfter,
  endingBefore,
}: {
  id: string;
  limit: number;
  startingAfter: string | null;
  endingBefore: string | null;
}) => {
  try {
    const extendedLimit = limit + 1;

    const query = (whereCondition?: SQL<any>) =>
      db
        .select()
        .from(ChatTable)
        .where(
          whereCondition
            ? and(whereCondition, eq(ChatTable.userId, id))
            : eq(ChatTable.userId, id)
        )
        .orderBy(desc(ChatTable.createdAt))
        .limit(extendedLimit);

    let filteredChats: Array<typeof ChatTable.$inferSelect> = [];

    if (startingAfter) {
      const [selectedChat] = await db
        .select()
        .from(ChatTable)
        .where(eq(ChatTable.id, startingAfter))
        .limit(1);

      if (!selectedChat) {
        throw new Error(`Chat with id ${startingAfter} not found`);
      }

      filteredChats = await query(
        gt(ChatTable.createdAt, selectedChat.createdAt)
      );
    } else if (endingBefore) {
      const [selectedChat] = await db
        .select()
        .from(ChatTable)
        .where(eq(ChatTable.id, endingBefore))
        .limit(1);

      if (!selectedChat) {
        throw new Error(`Chat with id ${endingBefore} not found`);
      }

      filteredChats = await query(
        lt(ChatTable.createdAt, selectedChat.createdAt)
      );
    } else {
      filteredChats = await query();
    }

    const hasMore = filteredChats.length > limit;

    return {
      chats: hasMore ? filteredChats.slice(0, limit) : filteredChats,
      hasMore,
    };
  } catch (error) {
    throw new Error("Failed to get chats by user id");
  }
};

export const getChatById = async ({ id }: { id: string }) => {
  try {
    const [selectedChat] = await db
      .select()
      .from(ChatTable)
      .where(eq(ChatTable.id, id));
    return selectedChat;
  } catch (error) {
    console.error("Error in getChatById:", error);
    throw new Error(
      `Failed to get chat by id: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

export const getChatByEntryId = async ({
  entryId,
  userId,
}: {
  entryId: string;
  userId: string;
}) => {
  try {
    const [selectedChat] = await db
      .select()
      .from(ChatTable)
      .where(and(eq(ChatTable.entryId, entryId), eq(ChatTable.userId, userId)))
      .orderBy(desc(ChatTable.createdAt))
      .limit(1);
    return selectedChat;
  } catch (error) {
    console.error("Error in getChatByEntryId:", error);
    throw new Error(
      `Failed to get chat by entry id: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

export const getChatByDocumentId = async ({
  documentId,
  documentCreatedAt,
  userId,
}: {
  documentId: string;
  documentCreatedAt: Date;
  userId: string;
}) => {
  try {
    const [selectedChat] = await db
      .select()
      .from(ChatTable)
      .where(
        and(
          eq(ChatTable.documentId, documentId),
          eq(ChatTable.documentCreatedAt, documentCreatedAt),
          eq(ChatTable.userId, userId)
        )
      )
      .orderBy(desc(ChatTable.createdAt))
      .limit(1);
    return selectedChat;
  } catch (error) {
    console.error("Error in getChatByDocumentId:", error);
    throw new Error(
      `Failed to get chat by document id: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

export const saveMessages = async ({
  messages,
}: {
  messages: Array<typeof MessageTable.$inferSelect>;
}) => {
  try {
    return await db.insert(MessageTable).values(messages);
  } catch (error) {
    console.error("Error in saveMessages:", error);
    console.error("Message data:", JSON.stringify(messages, null, 2));
    throw new Error(
      `Failed to save messages: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

export const getMessageById = async ({ id }: { id: string }) => {
  try {
    return await db.select().from(MessageTable).where(eq(MessageTable.id, id));
  } catch (error) {
    throw new Error("Failed to get message by id");
  }
};

export const getMessagesByChatId = async ({ id }: { id: string }) => {
  try {
    return await db
      .select()
      .from(MessageTable)
      .where(eq(MessageTable.chatId, id))
      .orderBy(asc(MessageTable.createdAt));
  } catch (error) {
    throw new Error("Failed to get messages by chat id");
  }
};

export const deleteMessagesByChatIdAfterTimestamp = async ({
  chatId,
  timestamp,
}: {
  chatId: string;
  timestamp: Date;
}) => {
  try {
    const messagesToDelete = await db
      .select({ id: MessageTable.id })
      .from(MessageTable)
      .where(
        and(
          eq(MessageTable.chatId, chatId),
          gte(MessageTable.createdAt, timestamp)
        )
      );

    const messageIds = messagesToDelete.map((message) => message.id);

    if (messageIds.length > 0) {
      await db
        .delete(VoteTable)
        .where(
          and(
            eq(VoteTable.chatId, chatId),
            inArray(VoteTable.messageId, messageIds)
          )
        );

      return await db
        .delete(MessageTable)
        .where(
          and(
            eq(MessageTable.chatId, chatId),
            inArray(MessageTable.id, messageIds)
          )
        );
    }
  } catch (error) {
    throw new Error("Failed to delete messages by chat id after timestamp");
  }
};

export const voteMessage = async ({
  chatId,
  messageId,
  type,
}: {
  chatId: string;
  messageId: string;
  type: "up" | "down";
}) => {
  try {
    const [existingVote] = await db
      .select()
      .from(VoteTable)
      .where(and(eq(VoteTable.messageId, messageId)));

    if (existingVote) {
      return await db
        .update(VoteTable)
        .set({ isUpvoted: type === "up" })
        .where(
          and(eq(VoteTable.messageId, messageId), eq(VoteTable.chatId, chatId))
        );
    }
    return await db.insert(VoteTable).values({
      chatId,
      messageId,
      isUpvoted: type === "up",
    });
  } catch (error) {
    throw new Error("Failed to vote message");
  }
};

export const getVotesByChatId = async ({ id }: { id: string }) => {
  try {
    return await db.select().from(VoteTable).where(eq(VoteTable.chatId, id));
  } catch (error) {
    throw new Error("Failed to get votes by chat id");
  }
};

export const updateChatVisiblityById = async ({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: "private" | "public";
}) => {
  try {
    return await db
      .update(ChatTable)
      .set({ visibility })
      .where(eq(ChatTable.id, chatId));
  } catch (error) {
    throw new Error("Failed to update chat visibility by id");
  }
};

export const getMessageCountByUserId = async ({
  id,
  differenceInHours,
}: {
  id: string | null;
  differenceInHours: number;
}) => {
  try {
    const twentyFourHoursAgo = new Date(
      Date.now() - differenceInHours * 60 * 60 * 1000
    );

    const [stats] = await db
      .select({ count: count(MessageTable.id) })
      .from(MessageTable)
      .innerJoin(ChatTable, eq(MessageTable.chatId, ChatTable.id))
      .where(
        and(
          eq(ChatTable.userId, id!),
          gte(MessageTable.createdAt, twentyFourHoursAgo),
          eq(MessageTable.role, "user")
        )
      )
      .execute();

    return stats?.count ?? 0;
  } catch (error) {
    throw new Error("Failed to get message count by user id");
  }
};

export const createStreamId = async ({
  streamId,
  chatId,
}: {
  streamId: string;
  chatId: string;
}) => {
  try {
    await db
      .insert(StreamTable)
      .values({ id: streamId, chatId, createdAt: new Date() });
  } catch (error) {
    throw new Error("Failed to create stream id");
  }
};

export const getStreamIdsByChatId = async ({ chatId }: { chatId: string }) => {
  try {
    const streamIds = await db
      .select({ id: StreamTable.id })
      .from(StreamTable)
      .where(eq(StreamTable.chatId, chatId))
      .orderBy(asc(StreamTable.createdAt))
      .execute();

    return streamIds.map(({ id }) => id);
  } catch (error) {
    throw new Error("Failed to get stream ids by chat id");
  }
};
