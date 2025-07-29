"use server";

export type CraftPersonalizedMessageInput = {
  playerName: string;
};

export type CraftPersonalizedMessageOutput = {
  message: string;
};

function getPersonalizedMessage(input: CraftPersonalizedMessageInput): CraftPersonalizedMessageOutput {
  const { playerName } = input;

  //
  // ВАЖНО: Отредактируйте этот текст, чтобы написать свое собственное поздравление!
  //
  const message = `С днем рождения, ${playerName}!\n\nИтак, я не слишком заню что говорить.\n Поздравляю тебя, желаю оставаться такой же умной, милой и классной)`;


  return { message };
}

// We keep the async structure to avoid breaking the component that calls it.
export async function getPersonalizedMessageAction(
  input: CraftPersonalizedMessageInput
): Promise<CraftPersonalizedMessageOutput> {
  console.log("Generating personalized message for:", input);
  try {
    const output = getPersonalizedMessage(input);
    return Promise.resolve(output);
  } catch (error) {
    console.error("Error crafting personalized message:", error);
    return { message: "Духи молчат. Не удалось сформировать послание." };
  }
}
