<template>
  <div class="large-board-page">
    <div class="large-board-intro">
      <h2>Large Card Board</h2>
      <p>
        Two columns, oversized cards, and shared drop zones so cards can move
        across columns or be reordered within each stack.
      </p>
    </div>

    <div class="large-board-grid">
      <section
        v-for="column in columns"
        :key="column.id"
        class="large-board-column"
      >
        <header class="large-board-column__header">
          <div>
            <p class="large-board-column__eyebrow">{{ column.eyebrow }}</p>
            <h3>{{ column.title }}</h3>
          </div>
          <span class="large-board-column__count">{{ column.cards.length }}</span>
        </header>

        <Container
          group-name="large-board-cards"
          class="large-board-dropzone"
          :get-child-payload="getCardPayload(column.id)"
          drag-class="large-board-card--ghost"
          drop-class="large-board-card--drop"
          :drop-placeholder="dropPlaceholderOptions"
          @drop="(dropResult) => onCardDrop(column.id, dropResult)"
        >
          <Draggable
            v-for="card in column.cards"
            :key="card.id"
          >
            <article class="large-board-card">
              <div class="large-board-card__top">
                <span class="large-board-card__badge">{{ card.badge }}</span>
                <span class="large-board-card__handle">&#x2630;</span>
              </div>

              <h4>{{ card.title }}</h4>
              <p class="large-board-card__body">{{ card.body }}</p>

              <div class="large-board-card__meta">
                <span>{{ card.owner }}</span>
                <span>{{ card.size }}</span>
              </div>
            </article>
          </Draggable>
        </Container>
      </section>
    </div>
  </div>
</template>

<script>
import { Container, Draggable } from "vue3-smooth-dnd";
import { applyDrag } from "../utils/helpers";

const createCard = (id, badge, title, body, owner, size) => ({
  id,
  badge,
  title,
  body,
  owner,
  size,
});

const initialColumns = [
  {
    id: "column-planning",
    eyebrow: "Column 01",
    title: "Planning",
    cards: [
      createCard(
        "plan-1",
        "Discovery",
        "Rebuild customer onboarding board",
        "Large draggable card with enough height to stress test pointer detection, placeholder sizing, and reorder feedback.",
        "Owner: Maya",
        "5 subtasks"
      ),
      createCard(
        "plan-2",
        "UX",
        "Define handoff checklist for sales to success",
        "Move this card to the right column or reorder it in place. The containers share the same group so cross-column drops are accepted.",
        "Owner: Idris",
        "3 attachments"
      ),
      createCard(
        "plan-3",
        "Content",
        "Draft migration notes for enterprise accounts",
        "This item is intentionally tall enough to behave more like a board card than a compact list row.",
        "Owner: Nina",
        "8 comments"
      ),
      createCard(
        "plan-4",
        "Ops",
        "Map the dependencies between provisioning, billing, and support handoff",
        "A longer planning card with enough content to make the board feel closer to a real working queue instead of a minimal drag list demo.",
        "Owner: Rafi",
        "6 linked tasks"
      ),
      createCard(
        "plan-5",
        "Research",
        "Collect edge cases for drag previews inside narrow transformed columns",
        "This card adds more vertical density and gives the board more opportunities to test scrolling and insertion behavior while dragging.",
        "Owner: Dita",
        "9 findings"
      ),
    ],
  },
  {
    id: "column-execution",
    eyebrow: "Column 02",
    title: "Execution",
    cards: [
      createCard(
        "exec-1",
        "Build",
        "Ship board interactions for the new admin workspace",
        "Cards can move between columns and settle into any row position inside the target stack.",
        "Owner: Theo",
        "2 blockers"
      ),
      createCard(
        "exec-2",
        "QA",
        "Verify long-card drag behavior under transformed containers",
        "Useful for checking how drop previews and collision logic behave with bigger draggable surfaces.",
        "Owner: Sana",
        "4 scenarios"
      ),
      createCard(
        "exec-3",
        "Launch",
        "Prepare release checklist and rollback notes",
        "Another large card so both columns start with several rows and enough mass for realistic reordering.",
        "Owner: Aiko",
        "1 milestone"
      ),
      createCard(
        "exec-4",
        "Review",
        "Audit drop behavior when moving the biggest cards across both columns",
        "Use this one to stress-test long drags, placeholder growth, and the final landing position after crossing the gutter.",
        "Owner: Omar",
        "7 checks"
      ),
      createCard(
        "exec-5",
        "Docs",
        "Write implementation notes for column-to-column card movement",
        "A final oversized item to keep the board populated and visually balanced across both stacks.",
        "Owner: Juno",
        "5 sections"
      ),
    ],
  },
];

export default {
  name: "LargeCardsBoard",
  components: { Container, Draggable },
  data() {
    return {
      columns: initialColumns.map((column) => ({
        ...column,
        cards: [...column.cards],
      })),
      dropPlaceholderOptions: {
        className: "large-board-drop-preview",
        animationDuration: "180",
        showOnTop: true,
      },
    };
  },
  methods: {
    onCardDrop(columnId, dropResult) {
      if (dropResult.removedIndex === null && dropResult.addedIndex === null) {
        return;
      }

      const columns = [...this.columns];
      const columnIndex = columns.findIndex((column) => column.id === columnId);
      const column = columns[columnIndex];

      columns.splice(columnIndex, 1, {
        ...column,
        cards: applyDrag(column.cards, dropResult),
      });

      this.columns = columns;
    },
    getCardPayload(columnId) {
      return (index) => {
        const column = this.columns.find((item) => item.id === columnId);
        return column.cards[index];
      };
    },
  },
};
</script>

<style scoped>
.large-board-page {
  max-width: 1240px;
  margin: 0 auto;
}

.large-board-intro {
  margin: 0 auto 24px;
  max-width: 900px;
}

.large-board-intro h2 {
  margin: 0 0 10px;
  font-size: 34px;
  line-height: 1.05;
}

.large-board-intro p {
  margin: 0;
  max-width: 720px;
  color: #556255;
  font-size: 16px;
  line-height: 1.6;
}

.large-board-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
  align-items: start;
}

.large-board-column {
  min-width: 0;
  border: 1px solid rgba(31, 42, 31, 0.12);
  border-radius: 24px;
  background: rgba(255, 252, 244, 0.92);
  box-shadow: 0 24px 48px rgba(53, 45, 27, 0.12);
  overflow: hidden;
}

.large-board-column__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 20px 16px;
  border-bottom: 1px solid rgba(31, 42, 31, 0.1);
}

.large-board-column__header h3 {
  margin: 2px 0 0;
  font-size: 24px;
}

.large-board-column__eyebrow {
  margin: 0;
  color: #1f7a5c;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.large-board-column__count {
  min-width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: #1f7a5c;
  color: #fff;
  font-weight: 700;
}

.large-board-dropzone {
  min-height: 420px;
  padding: 18px;
  box-sizing: border-box;
}

.large-board-card {
  margin-bottom: 16px;
  padding: 24px;
  min-height: 300px;
  border-radius: 22px;
  background: linear-gradient(180deg, #ffffff 0%, #f9f4ea 100%);
  border: 1px solid rgba(31, 42, 31, 0.1);
  box-shadow: 0 16px 28px rgba(59, 49, 29, 0.1);
  cursor: move;
}

.large-board-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.large-board-card__badge {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(31, 122, 92, 0.12);
  color: #115742;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.large-board-card__handle {
  color: #7d8a79;
  font-size: 20px;
}

.large-board-card h4 {
  margin: 0 0 14px;
  font-size: 28px;
  line-height: 1.15;
}

.large-board-card__body {
  margin: 0 0 20px;
  color: #556255;
  font-size: 17px;
  line-height: 1.65;
}

.large-board-card__meta {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: #4a5948;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.large-board-card--ghost {
  opacity: 0.96;
  box-shadow: 0 20px 36px rgba(53, 45, 27, 0.16);
}

.large-board-card--drop {
  opacity: 1;
}

:deep(.large-board-drop-preview) {
  box-sizing: border-box;
  width: 100%;
  margin: 0 0 16px;
  min-height: 300px;
  border-radius: 22px;
  border: 2px dashed rgba(31, 122, 92, 0.32);
  background: rgba(31, 122, 92, 0.08);
}

@media (max-width: 900px) {
  .large-board-grid {
    grid-template-columns: 1fr;
  }

  .large-board-card {
    min-height: 240px;
  }
}
</style>
