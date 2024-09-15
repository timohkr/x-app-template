import { makeValidator, cleanEnv, port, str } from 'envalid';

const openApiKey = makeValidator((apiKey: string) => {
  if (/^sk-proj-.{100,}$/.test(apiKey)) {
    return apiKey;
  } else {
    throw new Error('Please obtain a valid OpenAPI-Key from https://platform.openai.com/api-keys');
  }
});

export const ValidateEnv = () => {
  console.log(process.env)
  return cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port({ devDefault: 3000 }),
    ORIGIN: str({ devDefault: '*' }),
    LOG_FORMAT: str({ devDefault: 'dev' }),
    LOG_DIR: str({ devDefault: '../logs' }),
    REWARD_AMOUNT: str({ devDefault: '1'}),
    ADMIN_MNEMONIC: str({devDefault: 'denial kitchen pet squirrel other broom bar gas better priority spoil cross'}),
    NETWORK_URL: str({ devDefault: 'http://localhost:8669' }),
    NETWORK_TYPE: str({ devDefault: 'solo' }),
    OPENAI_API_KEY: openApiKey(),
    MAX_FILE_SIZE: str({ devDefault: '10mb' }),
    ADMIN_ADDRESS: str({ default: '' }),
  });
};
