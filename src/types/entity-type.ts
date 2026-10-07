/** The category of a DIAL catalog entity. It picks the colour of the type label and the featured chip. */
export enum EntityType {
  Model = 'model',
  Agent = 'agent',
  Toolset = 'toolset',
  Skill = 'skill',
  /** Reusable text prompt. Carries a body instead of a runtime. */
  Prompt = 'prompt',
}
