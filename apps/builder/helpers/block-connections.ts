import { Typebot, Block } from 'models'

export const updateBlocksHasConnections = ({
  blocks,
  edges,
}: Typebot): Block[] => {
  if (blocks.length <= 1) {
    return blocks.map((block) => ({
      ...block,
      hasConnection: true,
    }))
  }

  return blocks.map((block) => {
    const hasConnection = !!edges.find(
      (edge) => edge.from.blockId === block.id || edge.to.blockId === block.id
    )

    block.hasConnection = hasConnection

    return block
  })
}
