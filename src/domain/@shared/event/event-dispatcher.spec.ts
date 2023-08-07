import { v4 as uuid } from "uuid";
import CustomerAddressChangedEvent from "../../customer/event/customer-address-changed.event";
import CustomerCreatedEvent from "../../customer/event/customer-created.event";
import EnviaConsoleLogHandler from "../../customer/event/handler/customer-address-changed.handler";
import EnviaConsoleLog1Handler from "../../customer/event/handler/first-customer-created.handler";
import { EnviaConsoleLog2Handler } from "../../customer/event/handler/second-customer-created.handler";
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../../product/event/product-created.event";
import EventDispatcher from "./event-dispatcher";

describe("Domain events tests", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      1
    );
    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);
  });

  it("should unregister an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      0
    );
  });

  it("should unregister all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregisterAll();

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeUndefined();
  });

  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    const productCreatedEvent = new ProductCreatedEvent({
      name: "Product 1",
      description: "Product 1 description",
      price: 10.0,
    });

    // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
    eventDispatcher.notify(productCreatedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });

  it('should notify event customer created', () => {
    const eventDispatcher = new EventDispatcher();
    const firstCustomerEventHandler = new EnviaConsoleLog1Handler();
    const secondCustomerEventHandler = new EnviaConsoleLog2Handler();

    const firstSpyEventHandler = jest.spyOn(firstCustomerEventHandler, "handle");
    const secondSpyEventHandler = jest.spyOn(secondCustomerEventHandler, "handle"); 

    eventDispatcher.register('CustomerCreatedEvent', firstCustomerEventHandler);
    eventDispatcher.register('CustomerCreatedEvent', secondCustomerEventHandler);

    const customerCreatedEvent = new CustomerCreatedEvent({});

    eventDispatcher.notify(customerCreatedEvent);

    expect(firstSpyEventHandler).toHaveBeenCalled();
    expect(secondSpyEventHandler).toHaveBeenCalled()
  });

  it('should notify event customer changed address', () => {
    const eventDispatcher = new EventDispatcher();
    const customerAddressChangedHandler = new EnviaConsoleLogHandler();

    const spyEventHandler = jest.spyOn(customerAddressChangedHandler, "handle");

    eventDispatcher.register('CustomerAddressChangedEvent', customerAddressChangedHandler);

    const customerAddressChangedEvent = new CustomerAddressChangedEvent(
      {
        id: uuid(),
        name: 'Bruce Wayne',
        address: '224 Park Dr. Gothan City, ',
      }  
    );

    eventDispatcher.notify(customerAddressChangedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });

});
